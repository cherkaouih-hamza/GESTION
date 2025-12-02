// api/user-manager.js
import { Pool } from 'pg';
import { corsHeaders } from '../utils/cors';

export default async function handler(req, res) {
  // Configuration du pool pour chaque requête (meilleur pour les fonctions serverless)
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 1, // Utiliser une connexion unique pour les fonctions serverless
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
  });

  // Handle CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    await pool.end(); // Fermer le pool pour les requêtes OPTIONS
    return res.end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  try {
    // Parse the URL to handle different routes
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;
    const pathParts = path.split('/').filter(Boolean);
    
    // Find user-related parameters
    const userId = pathParts.includes('user-manager') ? pathParts[pathParts.indexOf('user-manager') + 1] : null;
    const userEmail = pathParts.includes('email') ? pathParts[pathParts.indexOf('email') + 1] : null;

    // Handle different endpoints based on path
    if (userEmail && !userId) {
      // Handle email-based operations
      if (req.method === 'GET') {
        // Get user by email
        const result = await pool.query('SELECT id, username, email, role, is_active FROM users WHERE email = $1', [userEmail]);
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.status(200).json(result.rows[0]);
      } else {
        res.status(405).json({ error: 'Méthode non autorisée pour cette route email' });
      }
    } else if (userId) {
      // Handle individual user operations
      if (req.method === 'GET') {
        // Récupérer un utilisateur spécifique
        const result = await pool.query('SELECT id, username, email, role, pole, is_active, created_at, updated_at FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.status(200).json(result.rows[0]);
      } else if (req.method === 'PUT') {
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
        // Supprimer un utilisateur
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
    } else {
      // Handle all users operations
      if (req.method === 'GET') {
        // Récupérer tous les utilisateurs
        const result = await pool.query(
          'SELECT id, username, email, role, pole, is_active, created_at, updated_at FROM users ORDER BY username'
        );
        res.status(200).json(result.rows);
      } else if (req.method === 'POST') {
        // Créer un nouvel utilisateur
        const { username, email, password, role, pole, is_active = false, phone } = req.body;

        if (!username || !email) {
          return res.status(400).json({ error: 'Le nom d\'utilisateur et l\'email sont requis' });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await pool.query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]);
        if (existingUser.rows.length > 0) {
          return res.status(409).json({ error: 'Un utilisateur avec cet email ou nom d\'utilisateur existe déjà' });
        }

        const result = await pool.query(
          'INSERT INTO users (username, email, password, role, pole, is_active, phone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, username, email, role, pole, is_active',
          [username, email, password, role, pole, is_active, phone]
        );

        res.status(201).json(result.rows[0]);
      } else {
        res.status(405).json({ error: 'Méthode non autorisée' });
      }
    }
  } catch (error) {
    console.error('Erreur lors de la gestion des utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  } finally {
    await pool.end(); // Toujours fermer le pool dans le bloc finally
  }
}