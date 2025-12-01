// api/test-db-connection.js
import pool from '../lib/db';
import Cors from 'cors';
import { logDatabaseError, logDatabaseSuccess } from '../utils/dbLogger';

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

  if (req.method === 'GET') {
    try {
      // Test de connexion simple
      const start = Date.now();
      
      // Faire une requête simple pour tester la connexion
      const result = await pool.query('SELECT NOW() as now');
      
      const duration = Date.now() - start;
      
      logDatabaseSuccess('Test de connexion DB', result);
      
      res.status(200).json({
        status: 'success',
        message: 'Connexion à la base de données réussie',
        timestamp: result.rows[0].now,
        duration: `${duration}ms`,
        environment: process.env.NODE_ENV || 'development'
      });
    } catch (error) {
      logDatabaseError(error, 'Test de connexion DB');
      res.status(500).json({
        status: 'error',
        message: 'Échec de la connexion à la base de données',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}