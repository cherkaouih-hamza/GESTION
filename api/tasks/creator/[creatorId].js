// api/tasks/creator/[creatorId].js
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

  const { creatorId } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM tasks WHERE created_by = $1 ORDER BY created_at DESC', [creatorId]);
      res.status(200).json(result.rows);
    } catch (error) {
      logDatabaseError(error, 'GET tasks by creator');
      res.status(500).json({ error: 'Erreur serveur lors de la récupération des tâches créées' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}