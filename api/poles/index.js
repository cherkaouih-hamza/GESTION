// api/poles/index.js
import { Pool } from 'pg';
import { corsHeaders } from '../../utils/cors';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default async function handler(req, res) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    return res.end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  try {
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
  } catch (error) {
    console.error('Erreur lors de la gestion des pôles:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  } finally {
    // Ne pas fermer le pool ici dans un environnement serverless
  }
}