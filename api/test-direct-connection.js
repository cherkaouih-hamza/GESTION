// api/test-direct-connection.js
import { Pool } from 'pg';

// Utiliser l'URL directement codée pour tester la connexion
const DATABASE_URL = 'postgresql://neondb_owner:npg_E0Wx7dQqOJMw@ep-green-thunder-ahle9ndp-pooler.c-3.us-east-1.aws.neon.tech/IACSAS?sslmode=require&channel_binding=require';

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
      console.log('Tentative de connexion directe à la base de données...');
      
      // Créer une instance de pool avec l'URL codée en dur
      const pool = new Pool({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        max: 1,
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 30000,
      });

      console.log('Pool créé, tentative de requête...');
      const start = Date.now();
      
      // Faire une requête simple pour tester la connexion
      const result = await pool.query('SELECT NOW() as now, version() as postgres_version, current_database() as database_name');
      const duration = Date.now() - start;
      
      // Vérifier les tables existantes
      const tablesResult = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      
      const tableNames = tablesResult.rows.map(row => row.table_name);
      
      // Compter les tâches et les utilisateurs
      let taskCount = 0;
      let userCount = 0;
      
      if (tableNames.includes('tasks')) {
        const taskResult = await pool.query('SELECT COUNT(*) FROM tasks;');
        taskCount = parseInt(taskResult.rows[0].count);
      }
      
      if (tableNames.includes('users')) {
        const userResult = await pool.query('SELECT COUNT(*) FROM users;');
        userCount = parseInt(userResult.rows[0].count);
      }
      
      // Fermer la connexion
      await pool.end();

      console.log('Connexion directe réussie!');
      res.status(200).json({
        status: 'success',
        message: 'Connexion directe à la base de données réussie',
        timestamp: result.rows[0].now,
        postgres_version: result.rows[0].postgres_version,
        database_name: result.rows[0].database_name,
        duration: `${duration}ms`,
        environment: process.env.NODE_ENV || 'development',
        tables: tableNames,
        task_count: taskCount,
        user_count: userCount
      });
    } catch (error) {
      console.error('Erreur lors du test de connexion directe:', error);
      res.status(500).json({
        status: 'error',
        message: 'Échec de la connexion directe à la base de données',
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