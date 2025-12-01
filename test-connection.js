// test-connection.js
// Script de test de connexion directe à la base de données
const { Pool } = require('pg');

// Utiliser l'URL exacte que vous avez fournie
const DATABASE_URL = 'postgresql://neondb_owner:npg_E0Wx7dQqOJMw@ep-green-thunder-ahle9ndp-pooler.c-3.us-east-1.aws.neon.tech/IACSAS?sslmode=require&channel_binding=require';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { 
    rejectUnauthorized: false 
  },
  max: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000, // 20 secondes
});

async function testConnection() {
  console.log('🔍 Démarrage du test de connexion à la base de données...');
  console.log('📡 Connecté à l\'URL:', DATABASE_URL.replace(/:npg_[^@]+@/, ':***@'));
  
  const startTime = Date.now();
  
  try {
    console.log('🔗 Tentative de connexion...');
    
    const client = await pool.connect();
    console.log('✅ Connexion établie avec succès!');
    
    console.log('📊 Exécution d\'une requête simple...');
    const result = await client.query('SELECT NOW() as now, version() as postgres_version, current_database() as database_name;');
    
    const duration = Date.now() - startTime;
    
    console.log('📈 Résultats du test:');
    console.log(`   - Horodatage serveur: ${result.rows[0].now}`);
    console.log(`   - Version PostgreSQL: ${result.rows[0].postgres_version}`);
    console.log(`   - Base de données: ${result.rows[0].database_name}`);
    console.log(`   - Temps de connexion: ${duration}ms`);
    
    client.release();
    
    // Testons maintenant si la table tasks existe
    console.log('📋 Vérification des tables...');
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const tableNames = tablesResult.rows.map(row => row.table_name);
    console.log('   - Tables existantes:', tableNames);
    
    if (tableNames.includes('tasks')) {
      const countResult = await pool.query('SELECT COUNT(*) FROM tasks;');
      console.log('   - Nombre de tâches:', countResult.rows[0].count);
    }
    
    if (tableNames.includes('users')) {
      const countResult = await pool.query('SELECT COUNT(*) FROM users;');
      console.log('   - Nombre d\'utilisateurs:', countResult.rows[0].count);
    }
    
    console.log('🎉 Test de connexion terminé avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors du test de connexion:');
    console.error('   - Message:', error.message);
    console.error('   - Code:', error.code);
    console.error('   - Détails:', error.detail);
    console.error('   - Position:', error.position);
    
    // Identification des erreurs courantes
    if (error.code === 'ECONNREFUSED') {
      console.error('   - Problème: Connexion refusée - vérifiez l\'URL et le port');
    } else if (error.code === 'ENOTFOUND') {
      console.error('   - Problème: Hôte inconnu - vérifiez le nom d\'hôte dans l\'URL');
    } else if (error.code === '28P01') {
      console.error('   - Problème: Authentification échouée - vérifiez l\'utilisateur/mot de passe');
    } else if (error.code === '3D000') {
      console.error('   - Problème: Base de données non trouvée - vérifiez le nom de la base de données');
    } else if (error.code === '08006') {
      console.error('   - Problème: Échec de connexion - problème SSL ou réseau');
    }
  } finally {
    await pool.end();
    console.log('🔒 Pool de connexions fermé');
  }
}

// Lancer le test
testConnection();

module.exports = { testConnection };