const db = require('../config/db');

const Task = {
  // Créer une nouvelle tâche
  create: async (taskData) => {
    const { title, description, status, priority, pole, assignee, due_date, created_by } = taskData;
    const query = `
      INSERT INTO tasks (title, description, status, priority, pole, assignee, due_date, created_by, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *;
    `;
    const values = [title, description, status, priority, pole, assignee, due_date, created_by];
    
    const result = await db.query(query, values);
    return result.rows[0];
  },

  // Récupérer toutes les tâches
  getAll: async () => {
    const query = 'SELECT * FROM tasks ORDER BY created_at DESC';
    const result = await db.query(query);
    return result.rows;
  },

  // Récupérer une tâche par ID
  getById: async (id) => {
    const query = 'SELECT * FROM tasks WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  // Mettre à jour une tâche
  update: async (id, taskData) => {
    const { title, description, status, priority, pole, assignee, due_date } = taskData;
    const query = `
      UPDATE tasks 
      SET title = $1, description = $2, status = $3, priority = $4, pole = $5, assignee = $6, due_date = $7, updated_at = NOW()
      WHERE id = $8
      RETURNING *;
    `;
    const values = [title, description, status, priority, pole, assignee, due_date, id];
    
    const result = await db.query(query, values);
    return result.rows[0];
  },

  // Supprimer une tâche
  delete: async (id) => {
    const query = 'DELETE FROM tasks WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  // Récupérer les tâches par utilisateur assigné
  getByAssignee: async (assigneeId) => {
    const query = 'SELECT * FROM tasks WHERE assignee = $1 ORDER BY created_at DESC';
    const result = await db.query(query, [assigneeId]);
    return result.rows;
  },

  // Récupérer les tâches par utilisateur créateur
  getByCreator: async (creatorId) => {
    const query = 'SELECT * FROM tasks WHERE created_by = $1 ORDER BY created_at DESC';
    const result = await db.query(query, [creatorId]);
    return result.rows;
  }
};

module.exports = Task;