// api/task-manager.js - Task management API routes for Vercel
const { getPool } = require('./db');

module.exports = async function handler(req, res) {
  // Configuration CORS pour Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const pool = await getPool();

    const url = new URL(req.url, `https://${req.headers.host}`);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const taskId = pathParts[1]; // La deuxième partie après le premier segment dans Vercel

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

      if (!title || !status || !priority || !pole || !created_by) {
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
      return res.status(405).json({ error: 'Méthode non autorisée' });
    }
  } catch (error) {
    console.error('Erreur dans task-manager handler:', error);
    console.error('Détails de l\'erreur:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
}