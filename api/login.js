// api/login.js - Endpoint de connexion pour Vercel
const { getPool } = require('./db');
const crypto = require('crypto');

module.exports = async function handler(req, res) {
  // Configuration CORS pour Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const pool = await getPool();
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Trouver l'utilisateur
    const result = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const user = result.rows[0];

    // Vérifier le mot de passe avec hachage
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    if (hashedPassword !== user.password) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    if (!user.is_active) {
      return res.status(401).json({ message: 'Compte en attente d\'activation. Veuillez contacter un administrateur.' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        is_active: user.is_active
      }
    });
  } catch (error) {
    console.error('Erreur lors du login:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
}