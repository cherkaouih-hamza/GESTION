// migrate-database.js
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

async function migrateDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 1, // Utiliser une connexion unique pour les fonctions serverless
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
  });

  try {
    console.log('🔍 Migration de la base de données...');
    
    // Vérifier si le champ phone existe, sinon l'ajouter
    console.log('Vérification du champ phone...');
    let result = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'phone'
    `);
    
    if (result.rows.length === 0) {
      console.log('Ajout du champ phone...');
      await pool.query('ALTER TABLE users ADD COLUMN phone VARCHAR(20)');
      console.log('✅ Champ phone ajouté');
    } else {
      console.log('✅ Champ phone existe déjà');
    }
    
    // Vérifier si le champ is_active existe, sinon l'ajouter
    console.log('Vérification du champ is_active...');
    result = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'is_active'
    `);
    
    if (result.rows.length === 0) {
      console.log('Ajout du champ is_active...');
      await pool.query('ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT FALSE');
      console.log('✅ Champ is_active ajouté avec valeur par défaut FALSE');
    } else {
      console.log('✅ Champ is_active existe déjà');
    }
    
    // Mettre à jour la valeur par défaut pour le champ role
    console.log('Mise à jour de la valeur par défaut pour le champ role...');
    await pool.query("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'utilisateur'");
    
    // Mettre à jour les rôles existants qui sont 'user' vers 'utilisateur'
    console.log('Mise à jour des rôles existants...');
    await pool.query("UPDATE users SET role = 'utilisateur' WHERE role = 'user'");
    
    console.log('✅ Migration terminée avec succès');
    
    // Afficher la structure mise à jour
    console.log('\n📊 Structure mise à jour de la table users :');
    result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);
    
    result.rows.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable}, default: ${col.column_default})`);
    });
    
  } catch (error) {
    console.error('💥 Erreur lors de la migration:', error);
  } finally {
    await pool.end();
  }
}

migrateDatabase();