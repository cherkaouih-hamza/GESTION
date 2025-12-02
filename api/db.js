// api/db.js - Configuration de la base de données
const { Pool } = require('pg');

let pool;

// Créer un pool de connexions
function createPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 10,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
}

// Fonction pour obtenir une connexion
async function getPool() {
  if (!pool) {
    createPool();
  }
  return pool;
}

module.exports = {
  getPool,
  createPool
};