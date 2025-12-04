const { getPool } = require('./db');

module.exports = async function handler(req, res) {
  // Configuration CORS pour Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const pool = await getPool();

    console.log('Requête reçue à user-validation:', req.method, req.url);
    const url = new URL(req.url, `https://${req.headers.host}`);
    const pathParts = url.pathname.split('/').filter(Boolean);
    console.log('URL décomposée:', pathParts);

    // Pour /api/user-validation/7/approve par exemple
    const userId = pathParts[2]; // L'ID devrait être le troisième segment après 'api' et 'user-validation'
    const action = pathParts[3]; // 'approve' ou 'reject'
    
    console.log('User ID extrait:', userId, 'Action:', action);

    if (!userId) {
      return res.status(400).json({ error: 'ID utilisateur requis' });
    }

    // S'assurer que userId est un nombre
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) {
      return res.status(400).json({ error: 'ID utilisateur invalide' });
    }

    if (!action) {
      return res.status(400).json({ error: 'Action (approve/reject) requise' });
    }

    if (action !== 'approve' && action !== 'reject') {
      return res.status(400).json({ error: 'Action invalide: doit être "approve" ou "reject"' });
    }

    // Mettre à jour l'utilisateur
    const isActive = action === 'approve';
    const result = await pool.query(
      'UPDATE users SET is_active = $1, updated_at = $2 WHERE id = $3 RETURNING *',
      [isActive, new Date().toISOString(), userIdNum]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.status(200).json({
      message: `Utilisateur ${action === 'approve' ? 'approuvé' : 'rejeté'} avec succès`,
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur dans user-validation handler:', error);
    res.status(500).json({ 
      error: 'Erreur serveur interne', 
      details: error.message 
    });
  }
}