// test-vercel-db-connection.js
require('dotenv').config();

const { Pool } = require('pg');

// Configuration du pool pour tester la connexion
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 1, // Utiliser une seule connexion pour le test
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function testConnection() {
  console.log('🔍 Démarrage du test de connexion à la base de données...');
  
  const startTime = Date.now();
  
  try {
    console.log('🔗 Tentative de connexion à la base de données...');
    
    // Test de connexion
    const client = await pool.connect();
    
    console.log('✅ Connexion établie avec succès!');
    
    // Exécuter une requête simple
    const result = await client.query('SELECT NOW() as now, version() as postgres_version;');
    
    const duration = Date.now() - startTime;
    
    console.log('📊 Résultats du test:');
    console.log(`   - Horodatage serveur: ${result.rows[0].now}`);
    console.log(`   - Version PostgreSQL: ${result.rows[0].postgres_version}`);
    console.log(`   - Temps de connexion: ${duration}ms`);
    
    client.release();
    
    console.log('🎉 Test de connexion terminé avec succès!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du test de connexion:');
    console.error('   - Message:', error.message);
    console.error('   - Code:', error.code);
    console.error('   - Détails:', error.detail);
    
    // Vérifier si c'est une erreur de connexion
    if (error.code === 'ECONNREFUSED') {
      console.error('   - Problème: Connexion refusée - vérifiez l\'URL de la base de données');
    } else if (error.code === 'ENOTFOUND') {
      console.error('   - Problème: Hôte inconnu - vérifiez le nom d\'hôte dans l\'URL');
    } else if (error.code === '28P01') {
      console.error('   - Problème: Authentification échouée - vérifiez l\'utilisateur/mot de passe');
    } else if (error.code === '3D000') {
      console.error('   - Problème: Base de données non trouvée - vérifiez le nom de la base de données');
    }
    
    const duration = Date.now() - startTime;
    console.log(`   - Temps total d\'exécution: ${duration}ms`);
    
    process.exit(1);
  } finally {
    // Fermer le pool
    await pool.end();
  }
}

// Exécuter le test
testConnection();

module.exports = { testConnection };