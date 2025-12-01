// api/tasks/assignee/[assigneeId].js
import { Pool } from 'pg';
import Cors from 'cors';

// Initialize CORS middleware
const cors = Cors({
  methods: ['GET', 'HEAD'],
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

  const { assigneeId } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM tasks WHERE assignee = $1 ORDER BY created_at DESC', [assigneeId]);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches assignées:', error);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération des tâches assignées' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}