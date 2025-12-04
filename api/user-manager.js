// api/user-manager.js - Simplified user management API for Vercel
const { getPool } = require('./db');

module.exports = async function handler(req, res) {
  // Configuration CORS pour Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const pool = await getPool();
    
    // Extraire l'ID de l'URL via les paramètres de requête
    const url = new URL(req.url, `https://${req.headers.host}`);
    const userId = url.searchParams.get('id');
    const hasId = !!userId;
    console.log('User ID from query params:', userId, 'Has ID:', hasId);

    if (req.method === 'GET') {
      if (hasId && userId) {
        // Récupérer un utilisateur spécifique
        console.log('GET request for user ID:', userId);
        const userIdNum = parseInt(userId);
        if (isNaN(userIdNum)) {
          return res.status(400).json({ error: 'ID utilisateur invalide' });
        }
        const result = await pool.query('SELECT id, username, email, role, pole, is_active, created_at, updated_at FROM users WHERE id = $1', [userIdNum]);
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.status(200).json(result.rows[0]);
      } else {
        // Récupérer tous les utilisateurs
        console.log('GET request for all users');
        const result = await pool.query('SELECT id, username, email, role, pole, is_active, created_at, updated_at FROM users ORDER BY username');
        res.status(200).json(result.rows);
      }
    } else if (req.method === 'PUT') {
      console.log('PUT request received');
      if (!hasId || !userId) {
        return res.status(400).json({ error: 'ID utilisateur requis dans l\'URL' });
      }

      const userIdNum = parseInt(userId);
      if (isNaN(userIdNum)) {
        return res.status(400).json({ error: 'ID utilisateur invalide' });
      }

      const { username, email, role, pole, is_active, phone } = req.body;
      console.log('PUT request for user ID:', userIdNum, 'Data:', { username, email, role, pole, is_active, phone });

      // Construire la requête de mise à jour
      const updateFields = [];
      const updateValues = [];

      if (username !== undefined) {
        updateFields.push(`username = $${updateValues.length + 1}`);
        updateValues.push(username);
      }
      if (email !== undefined) {
        updateFields.push(`email = $${updateValues.length + 1}`);
        updateValues.push(email);
      }
      if (role !== undefined) {
        updateFields.push(`role = $${updateValues.length + 1}`);
        updateValues.push(role);
      }
      if (pole !== undefined) {
        updateFields.push(`pole = $${updateValues.length + 1}`);
        updateValues.push(pole);
      }
      if (is_active !== undefined) {
        updateFields.push(`is_active = $${updateValues.length + 1}`);
        updateValues.push(is_active);
      }
      if (phone !== undefined) {
        updateFields.push(`phone = $${updateValues.length + 1}`);
        updateValues.push(phone);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ error: 'Aucun champ à mettre à jour fourni' });
      }

      updateValues.push(userIdNum); // ID pour la clause WHERE
      const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${updateValues.length} RETURNING *`;
      
      console.log('Update query:', updateQuery);
      console.log('Update values:', updateValues);

      const result = await pool.query(updateQuery, updateValues);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.status(200).json(result.rows[0]);
    } else if (req.method === 'POST') {
      // Création d'utilisateur
      const { username, email, password, role, pole, is_active = false, phone } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Le nom d\'utilisateur, l\'email et le mot de passe sont requis' });
      }

      const existingUser = await pool.query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]);
      if (existingUser.rows.length > 0) {
        return res.status(409).json({ error: 'Un utilisateur avec cet email ou nom d\'utilisateur existe déjà' });
      }

      const crypto = require('crypto');
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

      const result = await pool.query(
        'INSERT INTO users (username, email, password, role, pole, is_active, phone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [username, email, hashedPassword, role, pole, is_active, phone || null]
      );

      res.status(201).json(result.rows[0]);
    } else if (req.method === 'DELETE') {
      if (!hasId || !userId) {
        return res.status(400).json({ error: 'ID utilisateur requis dans l\'URL' });
      }

      const userIdNum = parseInt(userId);
      if (isNaN(userIdNum)) {
        return res.status(400).json({ error: 'ID utilisateur invalide' });
      }

      const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userIdNum]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.status(200).json(result.rows[0]);
    } else {
      return res.status(405).json({ error: 'Méthode non autorisée: ' + req.method });
    }
  } catch (error) {
    console.error('Erreur dans user-manager handler:', error);
    res.status(500).json({ 
      error: 'Erreur serveur interne', 
      details: error.message,
      stack: error.stack 
    });
  }
}