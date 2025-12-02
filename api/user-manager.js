// api/user-manager.js - User management API routes
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();

// GET all users
router.get('/', async (req, res) => {
  let pool;
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 1,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
    });

    const result = await pool.query('SELECT id, username, email, role, pole, is_active, created_at, updated_at FROM users ORDER BY username');
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des utilisateurs' });
  } finally {
    if (pool) {
      await pool.end();
    }
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  let pool;
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 1,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
    });

    const result = await pool.query('SELECT id, username, email, role, pole, is_active, created_at, updated_at FROM users WHERE id = $1', [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'utilisateur' });
  } finally {
    if (pool) {
      await pool.end();
    }
  }
});

// POST create new user
router.post('/', async (req, res) => {
  const { username, email, password, role, pole, is_active = false, phone } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Le nom d\'utilisateur, l\'email et le mot de passe sont requis' });
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

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Un utilisateur avec cet email ou nom d\'utilisateur existe déjà' });
    }

    // Hacher le mot de passe avant de l'enregistrer
    const passwordUtils = require('../utils/password');
    const hashedPassword = passwordUtils.hashPassword(password);

    const result = await pool.query(
      'INSERT INTO users (username, email, password, role, pole, is_active, phone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, username, email, role, pole, is_active',
      [username, email, hashedPassword, role, pole, is_active, phone || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création de l\'utilisateur' });
  } finally {
    if (pool) {
      await pool.end();
    }
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const { username, email, role, pole, is_active, phone } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'ID utilisateur requis' });
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

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de l\'utilisateur' });
  } finally {
    if (pool) {
      await pool.end();
    }
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({ error: 'ID utilisateur requis' });
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

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression de l\'utilisateur' });
  } finally {
    if (pool) {
      await pool.end();
    }
  }
});

module.exports = router;