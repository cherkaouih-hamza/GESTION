const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Route pour récupérer tous les utilisateurs
router.get('/', async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des utilisateurs' });
  }
});

// Route pour récupérer un utilisateur par email
router.get('/email/:email', async (req, res) => {
  try {
    const user = await User.getByEmail(req.params.email);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'utilisateur' });
  }
});

// Route pour récupérer un utilisateur par ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'utilisateur' });
  }
});

// Route pour créer un nouvel utilisateur
router.post('/', async (req, res) => {
  try {
    const { username, email, password, role, pole } = req.body;
    
    // Vérifier que les champs obligatoires sont présents
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Les champs username, email et password sont obligatoires' });
    }
    
    const newUser = await User.create({
      username,
      email,
      password,
      role,
      pole
    });
    
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création de l\'utilisateur' });
  }
});

// Route pour mettre à jour un utilisateur
router.put('/:id', async (req, res) => {
  try {
    const { username, email, role, pole } = req.body;
    
    const updatedUser = await User.update(req.params.id, {
      username,
      email,
      role,
      pole
    });
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de l\'utilisateur' });
  }
});

// Route pour supprimer un utilisateur
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.delete(req.params.id);
    
    if (!deletedUser) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    res.json(deletedUser);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression de l\'utilisateur' });
  }
});

module.exports = router;