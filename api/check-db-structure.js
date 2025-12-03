const { getPool } = require('./db');

module.exports = async function handler(req, res) {
  // Configuration CORS pour Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const pool = await getPool();
    
    // Vérifier si la table tasks existe
    const tasksTableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'tasks'
      );
    `);
    
    const usersTableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    // Vérifier le nombre de tâches
    let tasksCount = 0;
    let usersCount = 0;
    let tasksSchema = null;
    let usersSchema = null;

    if (tasksTableCheck.rows[0].exists) {
      const tasksResult = await pool.query('SELECT COUNT(*) FROM tasks');
      tasksCount = parseInt(tasksResult.rows[0].count);
      
      // Vérifier la structure de la table tasks
      const tasksColumns = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'tasks'
        ORDER BY ordinal_position;
      `);
      tasksSchema = tasksColumns.rows;
    }

    if (usersTableCheck.rows[0].exists) {
      const usersResult = await pool.query('SELECT COUNT(*) FROM users');
      usersCount = parseInt(usersResult.rows[0].count);
      
      // Vérifier la structure de la table users
      const usersColumns = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position;
      `);
      usersSchema = usersColumns.rows;
    }

    res.status(200).json({
      tables: {
        tasks: {
          exists: tasksTableCheck.rows[0].exists,
          count: tasksCount,
          schema: tasksSchema
        },
        users: {
          exists: usersTableCheck.rows[0].exists,
          count: usersCount,
          schema: usersSchema
        }
      }
    });
  } catch (error) {
    console.error('Erreur dans check-db-structure handler:', error);
    res.status(500).json({ 
      error: 'Erreur serveur interne', 
      details: error.message 
    });
  }
}