// api/db-test.js - Endpoint to test database connection
const { getPool } = require('./db');

module.exports = async function handler(req, res) {
  // Configuration CORS pour Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const pool = await getPool();

    // Tester la connexion en exécutant une requête simple
    const result = await pool.query('SELECT NOW() as now, current_database() as database_name');
    
    res.status(200).json({ 
      success: true, 
      message: 'Connexion à la base de données réussie',
      server_time: result.rows[0].now,
      database_name: result.rows[0].database_name
    });
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Échec de la connexion à la base de données',
      error: error.message 
    });
  }
}