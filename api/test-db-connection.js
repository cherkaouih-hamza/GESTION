// api/test-db-connection.js
import { Pool } from 'pg';

// Configuration du pool pour le test
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 1, // Utiliser une seule connexion pour le test
});

export default async function handler(req, res) {
  // Définir les en-têtes CORS manuellement
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Remplacez avec votre domaine en production
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Gérer les requêtes OPTIONS (pré-vol)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      // Test de connexion simple
      const start = Date.now();
      
      // Faire une requête simple pour tester la connexion
      const result = await pool.query('SELECT NOW() as now, version() as postgres_version');
      
      const duration = Date.now() - start;

      res.status(200).json({
        status: 'success',
        message: 'Connexion à la base de données réussie',
        timestamp: result.rows[0].now,
        postgres_version: result.rows[0].postgres_version,
        duration: `${duration}ms`,
        environment: process.env.NODE_ENV || 'development'
      });
    } catch (error) {
      console.error('Erreur lors du test de connexion DB:', error);
      res.status(500).json({
        status: 'error',
        message: 'Échec de la connexion à la base de données',
        error: error.message,
        code: error.code,
        detail: error.detail || undefined
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}