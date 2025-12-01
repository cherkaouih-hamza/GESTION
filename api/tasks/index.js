// api/tasks/index.js (dans un dossier api à la racine pour Vercel Functions)
import pool from '../../lib/db';
import Cors from 'cors';
import { logDatabaseError, logDatabaseSuccess } from '../../utils/dbLogger';

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

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
      logDatabaseSuccess('GET tasks', result);
      res.status(200).json(result.rows);
    } catch (error) {
      logDatabaseError(error, 'GET tasks');
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

      logDatabaseSuccess('POST task', result);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      logDatabaseError(error, 'POST task');
      res.status(500).json({ error: 'Erreur serveur lors de la création de la tâche' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}