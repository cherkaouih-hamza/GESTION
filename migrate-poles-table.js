// Script de migration pour créer la table poles
const { Pool } = require('pg');
require('dotenv').config();

async function createPolesTable() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log('Création de la table poles...');

    // Créer la table poles
    await pool.query(`
      CREATE TABLE IF NOT EXISTS poles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insérer les pôles initiaux
    const poles = [
      { name: 'Production Générale', description: 'Toutes les activités de production générale' },
      { name: 'Koutoub', description: 'Activités liées aux publications et ouvrages' },
      { name: 'Traduction', description: 'Activités de traduction' },
      { name: 'Nadwate', description: 'Conférences et séminaires' },
      { name: 'Ziyarate', description: 'Activités de visites et pèlerinages' },
      { name: 'Projet (Wikalaat Assfar et Koutab Al-Tazkiya)', description: 'Projets spéciaux et voyages' },
      { name: 'Podcast', description: 'Émissions et contenus audio' },
      { name: 'Academia', description: 'Éducation et formations académiques' },
      { name: 'Autre', description: 'Autres activités non classées' }
    ];

    for (const pole of poles) {
      const existing = await pool.query(
        'SELECT id FROM poles WHERE name = $1',
        [pole.name]
      );
      
      if (existing.rows.length === 0) {
        await pool.query(
          'INSERT INTO poles (name, description, is_active) VALUES ($1, $2, $3)',
          [pole.name, pole.description, true]
        );
        console.log(`Pôle ajouté: ${pole.name}`);
      } else {
        console.log(`Pôle existe déjà: ${pole.name}`);
      }
    }

    console.log('Table poles créée avec succès et pôles initiaux ajoutés');
  } catch (error) {
    console.error('Erreur lors de la création de la table poles:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  createPolesTable()
    .then(() => {
      console.log('Migration des pôles terminée avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Échec de la migration:', error);
      process.exit(1);
    });
}