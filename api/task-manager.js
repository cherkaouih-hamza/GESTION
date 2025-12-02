// api/task-manager.js - Task management API routes
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();

// GET all tasks
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

    const result = await pool.query(
      `SELECT t.*, u.username as assignee_name, u2.username as created_by_name
       FROM tasks t
       LEFT JOIN users u ON t.assignee = u.id
       LEFT JOIN users u2 ON t.created_by = u2.id
       WHERE t.is_active = true
       ORDER BY t.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des tâches' });
  } finally {
    if (pool) {
      await pool.end();
    }
  }
});

// GET task by ID
router.get('/:id', async (req, res) => {
  const taskId = req.params.id;
  let pool;
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 1,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
    });

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
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de la tâche' });
  } finally {
    if (pool) {
      await pool.end();
    }
  }
});

// POST create new task
router.post('/', async (req, res) => {
  const { title, description, status, priority, pole, assignee, due_date, start_date, created_by, media_link, type, is_active = true } = req.body;

  if (!title || !status || !priority || !pole || !created_by) {
    return res.status(400).json({ error: 'Les champs title, status, priority, pole et created_by sont obligatoires' });
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

    const result = await pool.query(
      'INSERT INTO tasks (title, description, status, priority, pole, assignee, due_date, start_date, created_by, media_link, type, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW()) RETURNING *',
      [title, description, status, priority, pole, assignee || null, due_date, start_date, created_by, media_link || null, type || null, is_active]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création de la tâche' });
  } finally {
    if (pool) {
      await pool.end();
    }
  }
});

// PUT update task
router.put('/:id', async (req, res) => {
  const taskId = req.params.id;
  const { title, description, status, priority, pole, assignee, due_date, start_date, media_link, type, is_active, created_by } = req.body;

  if (!taskId) {
    return res.status(400).json({ error: 'ID tâche requis' });
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

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de la tâche' });
  } finally {
    if (pool) {
      await pool.end();
    }
  }
});

// DELETE task (soft delete - set is_active to false)
router.delete('/:id', async (req, res) => {
  const taskId = req.params.id;
  if (!taskId) {
    return res.status(400).json({ error: 'ID tâche requis' });
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

    const result = await pool.query(
      'UPDATE tasks SET is_active = false WHERE id = $1 RETURNING *',
      [taskId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    res.json({ message: 'Tâche désactivée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression de la tâche' });
  } finally {
    if (pool) {
      await pool.end();
    }
  }
});

module.exports = router;