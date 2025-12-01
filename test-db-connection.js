// test-db-connection.js
require('dotenv').config();
const db = require('./config/db');

const testConnection = async () => {
  try {
    console.log('Tentative de connexion à la base de données...');
    
    // Exécuter une requête simple pour tester la connexion
    const result = await db.query('SELECT NOW() as now');
    
    console.log('Connexion réussie à la base de données!');
    console.log('Heure du serveur PostgreSQL:', result.rows[0].now);
    
    // Vérifier si les tables existent
    const tables = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('Tables existantes dans la base de données:', tables.rows.map(row => row.table_name));
    
    // Fermer la connexion
    await db.pool.end();
    console.log('Connexion fermée avec succès');
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error.message);
    process.exit(1);
  }
};

// Exécuter le test si ce fichier est exécuté directement
if (require.main === module) {
  testConnection();
}

module.exports = testConnection;