// api/test-db-connection.js
import { Pool } from 'pg';

export default async function handler(req, res) {
  // Définir les en-têtes CORS manuellement
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Gérer les requêtes OPTIONS (pré-vol)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      console.log('Tentative de connexion à la base de données...');
      console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
      console.log('NODE_ENV:', process.env.NODE_ENV);

      if (!process.env.DATABASE_URL) {
        return res.status(500).json({
          status: 'error',
          message: 'DATABASE_URL non définie dans les variables d\'environnement'
        });
      }

      // Créer une instance de pool avec les détails de débogage
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        max: 1,
        connectionTimeoutMillis: 10000, // 10 secondes
        idleTimeoutMillis: 30000,
      });

      console.log('Pool créé, tentative de requête...');
      const start = Date.now();
      
      // Faire une requête simple pour tester la connexion
      const result = await pool.query('SELECT NOW() as now, version() as postgres_version');
      const duration = Date.now() - start;
      
      // Fermer la connexion
      await pool.end();

      console.log('Connexion réussie!');
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
        detail: error.detail || undefined,
        environment: process.env.NODE_ENV || 'development'
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}