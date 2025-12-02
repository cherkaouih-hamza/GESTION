// test-login-process.js
require('dotenv').config();
const { Pool } = require('pg');

async function testLoginProcess() {
  console.log('Démarrage du test de processus de login...');

  // Configuration du pool PostgreSQL
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    // Récupérer tous les utilisateurs de la base de données
    const allUsersResult = await pool.query('SELECT * FROM users');
    console.log(`Nombre total d'utilisateurs: ${allUsersResult.rows.length}`);
    
    console.log('\nTous les utilisateurs:');
    allUsersResult.rows.forEach(user => {
      console.log(`ID: ${user.id}, Email: ${user.email}, Username: ${user.username}, IsActive: ${user.is_active}, Password: ${user.password ? '***' : 'NULL'}`);
    });

    // Simuler le processus de login comme dans le frontend
    const identifier = 'cherkaoui.h@gmail.com'; // exemple d'identifiant
    const password = '123456'; // exemple de mot de passe
    
    console.log(`\nTest de login avec: identifiant='${identifier}', mot de passe='${password}'`);
    
    // Trouver l'utilisateur par email ou téléphone comme dans le frontend
    let user = null;
    
    // Chercher par email
    const userByEmail = allUsersResult.rows.find(u => u.email === identifier);
    if (userByEmail) {
      user = userByEmail;
      console.log(`Utilisateur trouvé par email: ${JSON.stringify(user)}`);
    } else {
      // Chercher par téléphone
      const userByPhone = allUsersResult.rows.find(u => u.phone === identifier || u.phone === identifier.replace(/[^0-9]/g, ''));
      if (userByPhone) {
        user = userByPhone;
        console.log(`Utilisateur trouvé par téléphone: ${JSON.stringify(user)}`);
      }
    }
    
    if (!user) {
      console.log('ERREUR: Utilisateur non trouvé dans la base de données');
    } else {
      console.log(`Utilisateur trouvé: ${JSON.stringify(user)}`);
      
      // Vérifier le mot de passe
      if (user.password !== password) {
        console.log(`ERREUR: Mauvais mot de passe. Attendu: '${user.password}', Reçu: '${password}'`);
      } else {
        console.log('Mot de passe correct');
      }
      
      // Vérifier is_active
      if (user.is_active === false || user.is_active === 'false' || user.is_active === 0) {
        console.log(`ERREUR: Compte inactif. Valeur is_active: ${user.is_active}`);
      } else {
        console.log('Compte actif');
      }
      
      // Résultat global
      if (user.password === password && user.is_active !== false && user.is_active !== 'false' && user.is_active !== 0) {
        console.log('\nRÉSULTAT: Login devrait réussir selon les critères de vérification');
      } else {
        console.log('\nRÉSULTAT: Login devrait échouer selon les critères de vérification');
      }
    }
  } catch (error) {
    console.error('Erreur lors du test:', error);
  } finally {
    await pool.end();
    console.log('\nTest terminé');
  }
}

testLoginProcess();