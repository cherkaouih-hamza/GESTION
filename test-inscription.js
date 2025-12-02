// Script de test pour vérifier l'inscription
require('dotenv').config();
const { Pool } = require('pg');

async function testRegistration() {
  console.log('Test de connexion à la base de données et d\'inscription...');

  let pool;
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 1,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
    });

    console.log('Connecté à la base de données, testons l\'insertion...');

    // Testons une insertion directe
    const testUsername = 'test_user_' + Date.now();
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'password123';
    
    // Hacher le mot de passe
    const crypto = require('crypto');
    const hashedPassword = crypto.createHash('sha256').update(testPassword).digest('hex');

    console.log('Tentative de création de l\'utilisateur:', { testUsername, testEmail });

    const result = await pool.query(
      'INSERT INTO users (username, email, password, role, is_active, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, role, is_active',
      [testUsername, testEmail, hashedPassword, 'utilisateur', false, '+212612345678']
    );

    console.log('✅ Utilisateur créé avec succès:', result.rows[0]);

    // Supprimons le test utilisateur
    await pool.query('DELETE FROM users WHERE email = $1', [testEmail]);
    console.log('🧹 Utilisateur de test supprimé');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    console.error('Code erreur:', error.code);
    console.error('Détail:', error.detail);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

testRegistration();