// api/poles.js (Vercel Function pour gérer tous les pôles)
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
    const poleId = pathParts[pathParts.length - 1]; // Dernier élément du chemin

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
  } catch (error) {
    console.error('Erreur lors de la gestion des pôles:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}