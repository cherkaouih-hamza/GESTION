// test-approval.js
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

async function testUserUpdate() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 1, // Utiliser une connexion unique pour les fonctions serverless
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
  });

  try {
    console.log('🔍 Test de la mise à jour d\'un utilisateur...');
    
    // Trouver un utilisateur inactif pour le test
    const result = await pool.query('SELECT * FROM users WHERE is_active = false LIMIT 1');
    
    if (result.rows.length === 0) {
      console.log('✅ Aucun utilisateur inactif trouvé - ce pourrait être le problème');
      console.log('   Si tous les utilisateurs sont déjà actifs, la page de validation ne montrera rien');
    } else {
      const user = result.rows[0];
      console.log('👤 Utilisateur trouvé pour le test:', user);
      
      // Essayer de mettre à jour l'utilisateur
      const updateResult = await pool.query(
        'UPDATE users SET is_active = true, updated_at = NOW() WHERE id = $1 RETURNING *',
        [user.id]
      );
      
      console.log('✅ Mise à jour réussie:', updateResult.rows[0]);
      
      // Annuler le changement pour ne pas affecter les données
      await pool.query(
        'UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1',
        [user.id]
      );
      
      console.log('🔄 Changement annulé - utilisateur remis à is_active = false');
    }
    
  } catch (error) {
    console.error('💥 Erreur lors du test:', error);
  } finally {
    await pool.end();
  }
}

testUserUpdate();