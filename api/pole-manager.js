// api/pole-manager.js
const { Pool } = require('pg');
const { corsHeaders } = require('../utils/cors');

module.exports = async function handler(req, res) {
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
    
    // Check if we have an ID in the path (e.g., /api/pole-manager/123)
    const id = pathParts.includes('pole-manager') ? pathParts[pathParts.indexOf('pole-manager') + 1] : null;

    if (id) {
      // Handle individual pole operations
      if (req.method === 'GET') {
        // Récupérer un pôle spécifique
        const result = await pool.query('SELECT * FROM poles WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Pôle non trouvé' });
        }

        res.status(200).json(result.rows[0]);
      } else if (req.method === 'PUT') {
        // Mettre à jour un pôle
        const { name, description, is_active } = req.body;

        // Vérifier si le pôle existe
        const existingPole = await pool.query('SELECT * FROM poles WHERE id = $1', [id]);
        if (existingPole.rows.length === 0) {
          return res.status(404).json({ error: 'Pôle non trouvé' });
        }

        const result = await pool.query(
          'UPDATE poles SET name = $1, description = $2, is_active = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
          [name, description, is_active, id]
        );

        res.status(200).json(result.rows[0]);
      } else if (req.method === 'DELETE') {
        // Supprimer un pôle (désactiver en fait)
        const result = await pool.query(
          'UPDATE poles SET is_active = false WHERE id = $1 RETURNING *',
          [id]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Pôle non trouvé' });
        }

        res.status(200).json({ message: 'Pôle désactivé avec succès' });
      } else {
        res.status(405).json({ error: 'Méthode non autorisée' });
      }
    } else {
      // Handle all poles operations
      if (req.method === 'GET') {
        // Récupérer tous les pôles
        const result = await pool.query(
          'SELECT * FROM poles WHERE is_active = true ORDER BY name'
        );
        res.status(200).json(result.rows);
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
      } else {
        res.status(405).json({ error: 'Méthode non autorisée' });
      }
    }
  } catch (error) {
    console.error('Erreur lors de la gestion des pôles:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  } finally {
    await pool.end(); // Toujours fermer le pool dans le bloc finally
  }
}