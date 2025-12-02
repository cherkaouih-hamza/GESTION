// api/pole-manager.js - Pole management API routes
const express = require('express');
const router = express.Router();
const { getPool } = require('./db');
require('dotenv').config();

// GET all poles
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.query(
      'SELECT * FROM poles WHERE is_active = true ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des pôles:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des pôles' });
  }
});

// GET pole by ID
router.get('/:id', async (req, res) => {
  const poleId = req.params.id;
  try {
    const pool = await getPool();

    const result = await pool.query('SELECT * FROM poles WHERE id = $1', [poleId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pôle non trouvé' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération du pôle:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération du pôle' });
  }
});

// POST create new pole
router.post('/', async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Le nom du pôle est requis' });
  }

  try {
    const pool = await getPool();

    const result = await pool.query(
      'INSERT INTO poles (name, description, is_active) VALUES ($1, $2, true) RETURNING *',
      [name, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la création du pôle:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création du pôle' });
  }
});

// PUT update pole
router.put('/:id', async (req, res) => {
  const poleId = req.params.id;
  const { name, description, is_active } = req.body;

  if (!poleId) {
    return res.status(400).json({ error: 'ID pôle requis' });
  }

  try {
    const pool = await getPool();

    // Vérifier si le pôle existe
    const existingPole = await pool.query('SELECT * FROM poles WHERE id = $1', [poleId]);
    if (existingPole.rows.length === 0) {
      return res.status(404).json({ error: 'Pôle non trouvé' });
    }

    const result = await pool.query(
      'UPDATE poles SET name = $1, description = $2, is_active = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [name, description, is_active, poleId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du pôle:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du pôle' });
  }
});

// DELETE pole (soft delete - set is_active to false)
router.delete('/:id', async (req, res) => {
  const poleId = req.params.id;
  if (!poleId) {
    return res.status(400).json({ error: 'ID pôle requis' });
  }

  try {
    const pool = await getPool();

    const result = await pool.query(
      'UPDATE poles SET is_active = false WHERE id = $1 RETURNING *',
      [poleId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pôle non trouvé' });
    }

    res.json({ message: 'Pôle désactivé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du pôle:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression du pôle' });
  }
});

module.exports = router;