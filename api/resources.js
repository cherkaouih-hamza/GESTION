// api/resources.js (Fonction Vercel pour les ressources)
const { Pool } = require('pg');

module.exports = async function handler(req, res) {
  // Configuration CORS pour Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let pool;
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 1,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
    });

    const url = new URL(req.url, `https://${req.headers.host}`);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    if (pathParts.length < 2) {
      return res.status(404).json({ error: 'Route non trouvée' });
    }

    const resourceType = pathParts[1]; // users, tasks, poles
    const resourceId = pathParts[2];

    if (resourceType === 'users') {
      return await handleUsers(req, res, pool, resourceId);
    } else if (resourceType === 'tasks') {
      return await handleTasks(req, res, pool, resourceId);
    } else if (resourceType === 'poles') {
      return await handlePoles(req, res, pool, resourceId);
    } else {
      return res.status(404).json({ error: 'Route non trouvée' });
    }
  } catch (error) {
    console.error('Erreur dans resources handler:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

// Fonction de gestion des utilisateurs
async function handleUsers(req, res, pool, userId) {
  if (req.method === 'GET') {
    if (userId) {
      // Récupérer un utilisateur spécifique
      const result = await pool.query('SELECT id, username, email, role, pole, is_active, created_at, updated_at FROM users WHERE id = $1', [userId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      res.status(200).json(result.rows[0]);
    } else {
      // Récupérer tous les utilisateurs
      const result = await pool.query('SELECT id, username, email, role, pole, is_active, created_at, updated_at FROM users ORDER BY username');
      res.status(200).json(result.rows);
    }
  } else if (req.method === 'POST') {
    // Créer un nouvel utilisateur
    const { username, email, password, role, pole, is_active = false, phone } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Le nom d\'utilisateur, l\'email et le mot de passe sont requis' });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Un utilisateur avec cet email ou nom d\'utilisateur existe déjà' });
    }

    // Hacher le mot de passe avant de l'enregistrer
    const crypto = require('crypto');
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const result = await pool.query(
      'INSERT INTO users (username, email, password, role, pole, is_active, phone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, username, email, role, pole, is_active',
      [username, email, hashedPassword, role, pole, is_active, phone]
    );

    res.status(201).json(result.rows[0]);
  } else if (req.method === 'PUT') {
    if (!userId) {
      return res.status(400).json({ error: 'ID utilisateur requis' });
    }

    // Mettre à jour un utilisateur
    const { username, email, role, pole, is_active, phone } = req.body;

    // Déterminer les champs à mettre à jour
    let updateFields = [];
    let updateValues = [];
    let updatePlaceholders = [];

    if (username !== undefined) {
      updateFields.push('username');
      updateValues.push(username);
      updatePlaceholders.push(`$${updateValues.length}`);
    }
    if (email !== undefined) {
      updateFields.push('email');
      updateValues.push(email);
      updatePlaceholders.push(`$${updateValues.length}`);
    }
    if (role !== undefined) {
      updateFields.push('role');
      updateValues.push(role);
      updatePlaceholders.push(`$${updateValues.length}`);
    }
    if (pole !== undefined) {
      updateFields.push('pole');
      updateValues.push(pole);
      updatePlaceholders.push(`$${updateValues.length}`);
    }
    if (is_active !== undefined) {
      updateFields.push('is_active');
      updateValues.push(is_active);
      updatePlaceholders.push(`$${updateValues.length}`);
    }
    if (phone !== undefined) {
      updateFields.push('phone');
      updateValues.push(phone);
      updatePlaceholders.push(`$${updateValues.length}`);
    }

    // Toujours mettre à jour updated_at
    updateFields.push('updated_at');
    updateValues.push(new Date().toISOString());
    updatePlaceholders.push(`$${updateValues.length}`);

    if (updateFields.length <= 1) { // Seulement updated_at est inclus
      return res.status(400).json({ error: 'Aucun champ à mettre à jour fourni' });
    }

    updateValues.push(userId); // Ajouter l'ID
    const updateQuery = `UPDATE users SET ${updateFields.map((field, index) => `${field} = ${updatePlaceholders[index]}`).join(', ')} WHERE id = $${updateValues.length} RETURNING *`;

    const result = await pool.query(updateQuery, updateValues);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.status(200).json(result.rows[0]);
  } else if (req.method === 'DELETE') {
    if (!userId) {
      return res.status(400).json({ error: 'ID utilisateur requis' });
    }

    // Supprimer un utilisateur (désactiver en fait)
    // Démarrer une transaction pour s'assurer que les suppressions sont atomiques
    await pool.query('BEGIN');

    // Supprimer d'abord les tâches créées par l'utilisateur
    await pool.query('DELETE FROM tasks WHERE created_by = $1', [userId]);

    // Supprimer les tâches assignées à l'utilisateur
    await pool.query('DELETE FROM tasks WHERE assignee = $1', [userId]);

    // Maintenant supprimer l'utilisateur
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);

    if (result.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    await pool.query('COMMIT');

    res.status(200).json(result.rows[0]);
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}

// Fonction de gestion des tâches
async function handleTasks(req, res, pool, taskId) {
  if (req.method === 'GET') {
    if (taskId) {
      // Récupérer une tâche spécifique
      const result = await pool.query(
        `SELECT t.*, u.username as assignee_name, u2.username as created_by_name
         FROM tasks t
         LEFT JOIN users u ON t.assignee = u.id
         LEFT JOIN users u2 ON t.created_by = u2.id
         WHERE t.id = $1`, [taskId]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tâche non trouvée' });
      }
      res.status(200).json(result.rows[0]);
    } else {
      // Récupérer toutes les tâches
      const result = await pool.query(
        `SELECT t.*, u.username as assignee_name, u2.username as created_by_name
         FROM tasks t
         LEFT JOIN users u ON t.assignee = u.id
         LEFT JOIN users u2 ON t.created_by = u2.id
         WHERE t.is_active = true
         ORDER BY t.created_at DESC`
      );
      res.status(200).json(result.rows);
    }
  } else if (req.method === 'POST') {
    // Créer une nouvelle tâche
    const { title, description, status, priority, pole, assignee, due_date, start_date, created_by, media_link, type, is_active = true } = req.body;

    console.log('Requête de création de tâche:', req.body);

    if (!title || !status || !priority || !pole || !created_by) {
      console.log('Validation échouée - champs manquants:', {
        hasTitle: !!title,
        hasStatus: !!status,
        hasPriority: !!priority,
        hasPole: !!pole,
        hasCreatedBy: !!created_by,
        created_by: created_by
      });
      return res.status(400).json({ error: 'Les champs title, status, priority, pole et created_by sont obligatoires' });
    }

    const result = await pool.query(
      'INSERT INTO tasks (title, description, status, priority, pole, assignee, due_date, start_date, created_by, media_link, type, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW()) RETURNING *',
      [title, description, status, priority, pole, assignee || null, due_date, start_date, created_by, media_link || null, type || null, is_active]
    );

    res.status(201).json(result.rows[0]);
  } else if (req.method === 'PUT') {
    if (!taskId) {
      return res.status(400).json({ error: 'ID tâche requis' });
    }

    // Mettre à jour une tâche
    const { title, description, status, priority, pole, assignee, due_date, start_date, media_link, type, is_active, created_by } = req.body;

    // Déterminer les champs à mettre à jour
    let updateFields = [];
    let updateValues = [];
    let updatePlaceholders = [];

    if (title !== undefined) {
      updateFields.push('title');
      updateValues.push(title);
      updatePlaceholders.push(`$${updateValues.length}`);
    }
    if (description !== undefined) {
      updateFields.push('description');
      updateValues.push(description);
      updatePlaceholders.push(`$${updateValues.length}`);
    }
    if (status !== undefined) {
      updateFields.push('status');
      updateValues.push(status);
      updatePlaceholders.push(`$${updateValues.length}`);
    }
    if (priority !== undefined) {
      updateFields.push('priority');
      updateValues.push(priority);
      updatePlaceholders.push(`$${updateValues.length}`);
    }
    if (pole !== undefined) {
      updateFields.push('pole');
      updateValues.push(pole);
      updatePlaceholders.push(`$${updateValues.length}`);
    }
    if (assignee !== undefined) {
      updateFields.push('assignee');
      updateValues.push(assignee);
      updatePlaceholders.push(`$${updateValues.length}`);
    }
    if (due_date !== undefined) {
      updateFields.push('due_date');
      updateValues.push(due_date);
      updatePlaceholders.push(`$${updateValues.length}`);
    }
    if (start_date !== undefined) {
      updateFields.push('start_date');
      updateValues.push(start_date);
      updatePlaceholders.push(`$${updateValues.length}`);
    }
    if (media_link !== undefined) {
      updateFields.push('media_link');
      updateValues.push(media_link);
      updatePlaceholders.push(`$${updateValues.length}`);
    }
    if (type !== undefined) {
      updateFields.push('type');
      updateValues.push(type);
      updatePlaceholders.push(`$${updateValues.length}`);
    }
    if (is_active !== undefined) {
      updateFields.push('is_active');
      updateValues.push(is_active);
      updatePlaceholders.push(`$${updateValues.length}`);
    }
    if (created_by !== undefined) {
      updateFields.push('created_by');
      updateValues.push(created_by);
      updatePlaceholders.push(`$${updateValues.length}`);
    }

    // Toujours mettre à jour updated_at
    updateFields.push('updated_at');
    updateValues.push(new Date().toISOString());
    updatePlaceholders.push(`$${updateValues.length}`);

    if (updateFields.length <= 1) { // Seulement updated_at est inclus
      return res.status(400).json({ error: 'Aucun champ à mettre à jour fourni' });
    }

    updateValues.push(taskId); // Ajouter l'ID
    const updateQuery = `UPDATE tasks SET ${updateFields.map((field, index) => `${field} = ${updatePlaceholders[index]}`).join(', ')} WHERE id = $${updateValues.length} RETURNING *`;

    const result = await pool.query(updateQuery, updateValues);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    res.status(200).json(result.rows[0]);
  } else if (req.method === 'DELETE') {
    if (!taskId) {
      return res.status(400).json({ error: 'ID tâche requis' });
    }

    // Supprimer une tâche (désactiver en fait)
    const result = await pool.query(
      'UPDATE tasks SET is_active = false WHERE id = $1 RETURNING *',
      [taskId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    res.status(200).json({ message: 'Tâche désactivée avec succès' });
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}

// Fonction de gestion des pôles
async function handlePoles(req, res, pool, poleId) {
  if (req.method === 'GET') {
    if (poleId) {
      // Récupérer un pôle spécifique
      const result = await pool.query('SELECT * FROM poles WHERE id = $1', [poleId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Pôle non trouvé' });
      }

      res.status(200).json(result.rows[0]);
    } else {
      // Récupérer tous les pôles
      const result = await pool.query(
        'SELECT * FROM poles WHERE is_active = true ORDER BY name'
      );
      res.status(200).json(result.rows);
    }
  } else if (req.method === 'POST') {
    // Créer un nouveau pôle
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Le nom du pôle est requis' });
    }

    const result = await pool.query(
      'INSERT INTO poles (name, description, is_active) VALUES ($1, $2, true) RETURNING *',
      [name, description]
    );

    res.status(201).json(result.rows[0]);
  } else if (req.method === 'PUT') {
    if (!poleId) {
      return res.status(400).json({ error: 'ID pôle requis' });
    }

    // Mettre à jour un pôle
    const { name, description, is_active } = req.body;

    // Vérifier si le pôle existe
    const existingPole = await pool.query('SELECT * FROM poles WHERE id = $1', [poleId]);
    if (existingPole.rows.length === 0) {
      return res.status(404).json({ error: 'Pôle non trouvé' });
    }

    const result = await pool.query(
      'UPDATE poles SET name = $1, description = $2, is_active = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [name, description, is_active, poleId]
    );

    res.status(200).json(result.rows[0]);
  } else if (req.method === 'DELETE') {
    if (!poleId) {
      return res.status(400).json({ error: 'ID pôle requis' });
    }

    // Supprimer un pôle (désactiver en fait)
    const result = await pool.query(
      'UPDATE poles SET is_active = false WHERE id = $1 RETURNING *',
      [poleId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pôle non trouvé' });
    }

    res.status(200).json({ message: 'Pôle désactivé avec succès' });
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}