// Script pour vérifier la structure de la table poles et ses données
const { Pool } = require('pg');
require('dotenv').config();

async function checkPolesTable() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log('Vérification de la structure de la table poles...');

    // Vérifier la structure de la table poles
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'poles'
      ORDER BY ordinal_position;
    `);

    console.log('Structure de la table poles :');
    result.rows.forEach(row => {
      console.log(`${row.column_name}: ${row.data_type}, nullable: ${row.is_nullable}, default: ${row.column_default}`);
    });

    // Vérifier les données existantes
    const dataCheck = await pool.query('SELECT * FROM poles ORDER BY id');
    console.log(`\nPôles existants:`);
    dataCheck.rows.forEach(row => {
      console.log(`ID: ${row.id}, Name: ${row.name}, Active: ${row.is_active}`);
    });
  } catch (error) {
    console.error('Erreur lors de la vérification de la structure:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  checkPolesTable()
    .then(() => {
      console.log('\nVérification terminée avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Échec de la vérification:', error);
      process.exit(1);
    });
}