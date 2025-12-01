// api/tasks/index.js (dans un dossier api à la racine pour Vercel Functions)
import { Pool } from 'pg';
import Cors from 'cors';

// Initialize CORS middleware
const cors = Cors({
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
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
      const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération des tâches' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, description, status, priority, pole, assignee, due_date, created_by } = req.body;

      if (!title || !status || !priority || !pole || !created_by) {
        return res.status(400).json({ error: 'Les champs title, status, priority, pole et created_by sont obligatoires' });
      }

      const result = await pool.query(
        'INSERT INTO tasks (title, description, status, priority, pole, assignee, due_date, created_by, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) RETURNING *',
        [title, description, status, priority, pole, assignee, due_date, created_by]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      res.status(500).json({ error: 'Erreur serveur lors de la création de la tâche' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}