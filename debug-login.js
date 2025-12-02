// debug-login.js
require('dotenv').config();
const { Pool } = require('pg');
const axios = require('axios');

async function debugLogin() {
  console.log('=== DÉBUT DU DEBUG LOGIN ===');
  
  // Configuration du pool PostgreSQL
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    // Récupérer un utilisateur spécifique
    const email = 'cherkaoui.h@gmail.com';
    const password = '123456';
    
    console.log(`\\n1. Recherche de l'utilisateur: ${email}`);
    
    // Requête exacte comme celle faite dans l'authentification
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    console.log(`2. Résultat de la requête: ${result.rows.length} utilisateur(s) trouvé(s)`);
    
    if (result.rows.length === 0) {
      console.log('ERREUR: Aucun utilisateur trouvé avec cet email');
      return;
    }
    
    const user = result.rows[0];
    console.log('\\n3. Détails de l\'utilisateur:');
    console.log(`   - ID: ${user.id}`);
    console.log(`   - Username: ${user.username}`);
    console.log(`   - Email: ${user.email}`);
    console.log(`   - Role: ${user.role}`);
    console.log(`   - is_active: ${user.is_active}`);
    console.log(`   - Mot de passe dans DB: ${user.password}`);
    console.log(`   - Mot de passe fourni: ${password}`);
    console.log(`   - Comparaison mot de passe: ${user.password === password ? 'CORRECT' : 'INCORRECT'}`);
    
    // Vérification des conditions de login
    console.log('\\n4. Vérification des conditions de login:');
    
    const emailMatch = user.email === email;
    const passwordMatch = user.password === password;
    const isActive = user.is_active !== false && user.is_active !== 'false' && user.is_active !== 0;
    
    console.log(`   - Email correspond: ${emailMatch}`);
    console.log(`   - Mot de passe correspond: ${passwordMatch}`);
    console.log(`   - Compte actif: ${isActive}`);
    
    if (emailMatch && passwordMatch && isActive) {
      console.log('\\n✅ CONDITIONS DE LOGIN SATISFAITES - Le login devrait réussir');
    } else {
      console.log('\\n❌ CONDITIONS DE LOGIN NON SATISFAITES');
      if (!emailMatch) console.log('   - Problème: Email ne correspond pas');
      if (!passwordMatch) console.log('   - Problème: Mot de passe incorrect');
      if (!isActive) console.log('   - Problème: Compte inactif');
    }
    
    // Essayons aussi avec d'autres comptes actifs
    console.log('\\n5. Vérification d\'autres comptes actifs:');
    const activeUsers = await pool.query('SELECT email, username, is_active, password FROM users WHERE is_active = true LIMIT 5');
    console.log(`   Trouvé ${activeUsers.rows.length} comptes actifs`);
    
    for (const user of activeUsers.rows) {
      console.log(`   - Email: ${user.email}, Username: ${user.username}, Password: ${user.password}`);
    }
    
  } catch (error) {
    console.error('Erreur lors du debug:', error);
  } finally {
    await pool.end();
    console.log('\\n=== FIN DU DEBUG ===');
  }
}

debugLogin();