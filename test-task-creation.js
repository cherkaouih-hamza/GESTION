// Script de test pour simuler la création de tâche
const { Pool } = require('pg');
require('dotenv').config();

async function testTaskCreation() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log('Test de création de tâche...');

    // Test de la requête INSERT avec des données typiques
    const testData = {
      title: 'Test task from API',
      description: 'This is a test task',
      status: 'pending',
      priority: 'medium',
      pole: 'IT',
      assignee: 1,  // ID d'un utilisateur existant
      due_date: '2025-12-31',
      start_date: '2025-12-01',
      created_by: 1,  // ID de l'utilisateur courant
      media_link: null,
      type: 'work',
      is_active: true
    };

    console.log('Données envoyées:', testData);

    const result = await pool.query(
      'INSERT INTO tasks (title, description, status, priority, pole, assignee, due_date, start_date, created_by, media_link, type, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW()) RETURNING *',
      [
        testData.title,
        testData.description,
        testData.status,
        testData.priority,
        testData.pole,
        testData.assignee,
        testData.due_date,
        testData.start_date,
        testData.created_by,
        testData.media_link,
        testData.type,
        testData.is_active
      ]
    );

    console.log('Tâche créée avec succès:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  testTaskCreation()
    .then(() => {
      console.log('Test terminé avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Échec du test:', error);
      process.exit(1);
    });
}