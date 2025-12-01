const db = require('../config/db');

const User = {
  // Créer un nouvel utilisateur
  create: async (userData) => {
    const { username, email, password, role, pole } = userData;
    const query = `
      INSERT INTO users (username, email, password, role, pole, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *;
    `;
    const values = [username, email, password, role, pole];
    
    const result = await db.query(query, values);
    return result.rows[0];
  },

  // Récupérer un utilisateur par email
  getByEmail: async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  },

  // Récupérer un utilisateur par ID
  getById: async (id) => {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  // Récupérer tous les utilisateurs
  getAll: async () => {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const result = await db.query(query);
    return result.rows;
  },

  // Mettre à jour un utilisateur
  update: async (id, userData) => {
    const { username, email, role, pole } = userData;
    const query = `
      UPDATE users 
      SET username = $1, email = $2, role = $3, pole = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING *;
    `;
    const values = [username, email, role, pole, id];
    
    const result = await db.query(query, values);
    return result.rows[0];
  },

  // Supprimer un utilisateur
  delete: async (id) => {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = User;