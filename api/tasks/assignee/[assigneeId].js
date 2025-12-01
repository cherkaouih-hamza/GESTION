// api/tasks/assignee/[assigneeId].js
import pool from '../../../lib/db';
import Cors from 'cors';
import { logDatabaseError, logDatabaseSuccess } from '../../../utils/dbLogger';

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

export default async function handler(req, res) {
  // Définir les en-têtes CORS manuellement aussi
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Remplacez avec votre domaine en production
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Gérer les requêtes OPTIONS (pré-vol)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Run CORS middleware
  await runMiddleware(req, res, cors);

  const { assigneeId } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM tasks WHERE assignee = $1 ORDER BY created_at DESC', [assigneeId]);
      res.status(200).json(result.rows);
    } catch (error) {
      logDatabaseError(error, 'GET tasks by assignee');
      res.status(500).json({ error: 'Erreur serveur lors de la récupération des tâches assignées' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}