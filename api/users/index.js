// api/users/index.js
import pool from '../../lib/db';
import Cors from 'cors';
import { logDatabaseError, logDatabaseSuccess } from '../../utils/dbLogger';

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
      const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
      logDatabaseSuccess('GET users', result);
      res.status(200).json(result.rows);
    } catch (error) {
      logDatabaseError(error, 'GET users');
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

      logDatabaseSuccess('POST user', result);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      logDatabaseError(error, 'POST user');
      res.status(500).json({ error: 'Erreur serveur lors de la création de l\'utilisateur' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}