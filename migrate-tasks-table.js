// Script de migration pour ajouter les nouveaux champs à la table des tâches
const { Pool } = require('pg');

// Charger les variables d'environnement
require('dotenv').config();

async function migrateTasksTable() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log('Démarrage de la migration de la table tasks...');

    // Vérifier si la colonne start_date existe
    const startDateCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'tasks' AND column_name = 'start_date'
    `);

    if (startDateCheck.rows.length === 0) {
      console.log('Ajout de la colonne start_date...');
      await pool.query('ALTER TABLE tasks ADD COLUMN start_date DATE');
    } else {
      console.log('La colonne start_date existe déjà');
    }

    // Vérifier si la colonne media_link existe
    const mediaLinkCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'tasks' AND column_name = 'media_link'
    `);

    if (mediaLinkCheck.rows.length === 0) {
      console.log('Ajout de la colonne media_link...');
      await pool.query('ALTER TABLE tasks ADD COLUMN media_link TEXT');
    } else {
      console.log('La colonne media_link existe déjà');
    }

    // Vérifier si la colonne type existe
    const typeCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'tasks' AND column_name = 'type'
    `);

    if (typeCheck.rows.length === 0) {
      console.log('Ajout de la colonne type...');
      await pool.query('ALTER TABLE tasks ADD COLUMN type VARCHAR(50)');
    } else {
      console.log('La colonne type existe déjà');
    }

    // Vérifier si la colonne is_active existe
    const isActiveCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'tasks' AND column_name = 'is_active'
    `);

    if (isActiveCheck.rows.length === 0) {
      console.log('Ajout de la colonne is_active...');
      await pool.query('ALTER TABLE tasks ADD COLUMN is_active BOOLEAN DEFAULT TRUE');
    } else {
      console.log('La colonne is_active existe déjà');
    }

    console.log('Migration de la table tasks terminée avec succès!');
  } catch (error) {
    console.error('Erreur lors de la migration:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Exécuter la migration si le script est lancé directement
if (require.main === module) {
  migrateTasksTable()
    .then(() => {
      console.log('Migration terminée.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Échec de la migration:', error);
      process.exit(1);
    });
}

module.exports = { migrateTasksTable };