// api/task-manager.js - API de gestion des tâches pour Vercel
const { getPool } = require('./db');

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const pool = await getPool();

    // Analyse de l'URL
    const url = new URL(req.url, `https://${req.headers.host}`);
    const idParam = url.searchParams.get('id');
    const hasId = !!idParam;
    const taskIdNum = hasId ? parseInt(idParam, 10) : null;

    console.log('>>> task-manager called');
    console.log('Method:', req.method, 'idParam:', idParam, 'taskIdNum:', taskIdNum);

    // --- GET : liste ou une seule tâche ---
    if (req.method === 'GET') {
      if (hasId && !isNaN(taskIdNum)) {
        console.log('GET single task:', taskIdNum);
        const result = await pool.query(
          `SELECT t.*, u.username as assignee_name, u2.username as created_by_name
           FROM tasks t
           LEFT JOIN users u ON t.assignee = u.id
           LEFT JOIN users u2 ON t.created_by = u2.id
           WHERE t.id = $1`,
          [taskIdNum]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Tâche non trouvée' });
        }

        return res.status(200).json(result.rows[0]);
      } else {
        console.log('GET all tasks');
        const result = await pool.query(
          `SELECT t.*, u.username as assignee_name, u2.username as created_by_name
           FROM tasks t
           LEFT JOIN users u ON t.assignee = u.id
           LEFT JOIN users u2 ON t.created_by = u2.id
           WHERE t.is_active = true
           ORDER BY t.created_at DESC`
        );
        return res.status(200).json(result.rows);
      }
    }

    // --- POST : créer une nouvelle tâche ---
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      console.log('POST body:', body);

      const {
        title,
        description,
        status = 'pending',
        priority = 'Normal',
        pole,
        assignee,
        due_date,
        start_date,
        media_link,
        type,
        is_active = true,
        created_by,
        validated_by = null,
      } = body;

      if (!title || !description || !created_by) {
        return res.status(400).json({ error: 'title, description et created_by sont requis' });
      }

      const insertQuery = `
        INSERT INTO tasks (
          title, description, status, priority, pole, assignee,
          due_date, start_date, media_link, type,
          is_active, created_by, validated_by
        )
        VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10,
          $11, $12, $13
        )
        RETURNING *
      `;

      // Convertir les dates en format date seulement si elles sont fournies
      const formattedDueDate = due_date ? new Date(due_date).toISOString().split('T')[0] : null;
      const formattedStartDate = start_date ? new Date(start_date).toISOString().split('T')[0] : null;

      const values = [
        title,
        description,
        status,
        priority,
        pole || null,
        assignee || null,
        formattedDueDate,
        formattedStartDate,
        media_link || null,
        type || null,
        is_active,
        created_by,
        validated_by,
      ];

      console.log('Insert task query:', insertQuery);
      console.log('Values:', values);

      const result = await pool.query(insertQuery, values);
      return res.status(201).json(result.rows[0]);
    }

    // --- PUT : mettre à jour une tâche existante ---
    if (req.method === 'PUT') {
      if (!hasId || isNaN(taskIdNum)) {
        return res.status(400).json({ error: 'ID de tâche invalide ou manquant' });
      }

      const rawBody = req.body;
      const body = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;

      console.log('PUT task id:', taskIdNum);
      console.log('PUT body:', body);

      const {
        title,
        description,
        status,
        priority,
        pole,
        assignee,
        due_date,
        start_date,
        media_link,
        type,
        is_active,
        created_by,
        validated_by,
      } = body;

      const fields = [];
      const values = [];

      if (title !== undefined) {
        fields.push(`title = $${values.length + 1}`);
        values.push(title);
      }
      if (description !== undefined) {
        fields.push(`description = $${values.length + 1}`);
        values.push(description);
      }
      if (status !== undefined) {
        fields.push(`status = $${values.length + 1}`);
        values.push(status);
      }
      if (priority !== undefined) {
        fields.push(`priority = $${values.length + 1}`);
        values.push(priority);
      }
      if (pole !== undefined) {
        fields.push(`pole = $${values.length + 1}`);
        values.push(pole);
      }
      if (assignee !== undefined) {
        fields.push(`assignee = $${values.length + 1}`);
        values.push(assignee);
      }
      if (due_date !== undefined) {
        fields.push(`due_date = $${values.length + 1}`);
        values.push(due_date);
      }
      if (start_date !== undefined) {
        fields.push(`start_date = $${values.length + 1}`);
        values.push(start_date);
      }
      if (media_link !== undefined) {
        fields.push(`media_link = $${values.length + 1}`);
        values.push(media_link);
      }
      if (type !== undefined) {
        fields.push(`type = $${values.length + 1}`);
        values.push(type);
      }
      if (is_active !== undefined) {
        fields.push(`is_active = $${values.length + 1}`);
        values.push(is_active);
      }
      if (created_by !== undefined) {
        fields.push(`created_by = $${values.length + 1}`);
        values.push(created_by);
      }
      if (validated_by !== undefined) {
        fields.push(`validated_by = $${values.length + 1}`);
        values.push(validated_by);
      }

      if (fields.length === 0) {
        return res.status(400).json({ error: 'Aucun champ à mettre à jour fourni' });
      }

      // Mettre à jour updated_at automatiquement
      fields.push(`updated_at = NOW()`);

      values.push(taskIdNum);
      const updateQuery = `
        UPDATE tasks
        SET ${fields.join(', ')}
        WHERE id = $${values.length}
        RETURNING *
      `;

      console.log('Update task query:', updateQuery);
      console.log('Update values:', values);

      const result = await pool.query(updateQuery, values);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tâche non trouvée' });
      }

      return res.status(200).json(result.rows[0]);
    }

    // --- DELETE : supprimer une tâche ---
    if (req.method === 'DELETE') {
      if (!hasId || isNaN(taskIdNum)) {
        return res.status(400).json({ error: 'ID de tâche invalide ou manquant' });
      }

      console.log('DELETE task id:', taskIdNum);

      const result = await pool.query(
        'UPDATE tasks SET is_active = false WHERE id = $1 RETURNING *',
        [taskIdNum]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tâche non trouvée' });
      }

      return res.status(200).json(result.rows[0]);
    }

    // Méthode non autorisée
    return res.status(405).json({ error: 'Méthode non autorisée: ' + req.method });
  } catch (error) {
    console.error('Erreur dans task-manager handler:', error);
    return res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message,
      stack: error.stack,
    });
  }
};