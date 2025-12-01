// api/users/index.js
import { Pool } from 'pg';
import Cors from 'cors';

// Initialize CORS middleware
const cors = Cors({
  methods: ['GET', 'HEAD', 'POST'],
  origin: '*', // Limitez cela à votre domaine en production
});

// Helper method to wait for middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Create a PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default async function handler(req, res) {
  // Run CORS middleware
  await runMiddleware(req, res, cors);

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération des utilisateurs' });
    }
  } else if (req.method === 'POST') {
    try {
      const { username, email, password, role, pole } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Les champs username, email et password sont obligatoires' });
      }

      const result = await pool.query(
        'INSERT INTO users (username, email, password, role, pole, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *',
        [username, email, password, role, pole]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      res.status(500).json({ error: 'Erreur serveur lors de la création de l\'utilisateur' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}