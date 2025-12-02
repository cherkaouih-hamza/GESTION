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
    console.log('Tentative de connexion à la base de données...');
    
    const pool = await getPool();
    console.log('Pool obtenu avec succès');

    // Test simple de requête
    const result = await pool.query('SELECT NOW()');
    console.log('Requête test réussie:', result.rows);

    res.status(200).json({ 
      success: true, 
      message: 'Connexion à la base de données réussie',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    });
  }
}