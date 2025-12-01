const { Pool } = require('pg');
require('dotenv').config();

// Créer un pool de connexion PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Gérer les erreurs de connexion
pool.on('error', (err) => {
  console.error('Erreur de connexion à la base de données:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};