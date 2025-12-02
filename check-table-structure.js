// check-table-structure.js
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

async function checkTableStructure() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 1, // Utiliser une connexion unique pour les fonctions serverless
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
  });

  try {
    console.log('🔍 Vérification de la structure de la table users...');

    // Récupérer la structure de la table
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);

    console.log('📊 Structure de la table users :');
    result.rows.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable}, default: ${col.column_default})`);
    });

    // Vérifier si les contraintes d'unicité existent
    const constraints = await pool.query(`
      SELECT constraint_name, constraint_type
      FROM information_schema.table_constraints
      WHERE table_name = 'users';
    `);

    console.log('\n🔒 Contraintes de la table :');
    constraints.rows.forEach(constraint => {
      console.log(`- ${constraint.constraint_name}: ${constraint.constraint_type}`);
    });

  } catch (error) {
    console.error('💥 Erreur lors de la vérification de la structure:', error);
  } finally {
    await pool.end();
  }
}

checkTableStructure();