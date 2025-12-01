const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const User = require('../models/user');

// Route pour récupérer toutes les tâches
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.getAll();
    res.json(tasks);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des tâches' });
  }
});

// Route pour récupérer une tâche par ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.getById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }
    res.json(task);
  } catch (error) {
    console.error('Erreur lors de la récupération de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de la tâche' });
  }
});

// Route pour créer une nouvelle tâche
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, pole, assignee, due_date, created_by } = req.body;
    
    // Vérifier que les champs obligatoires sont présents
    if (!title || !status || !priority || !pole || !created_by) {
      return res.status(400).json({ error: 'Les champs title, status, priority, pole et created_by sont obligatoires' });
    }
    
    const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      pole,
      assignee,
      due_date,
      created_by
    });
    
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création de la tâche' });
  }
});

// Route pour mettre à jour une tâche
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status, priority, pole, assignee, due_date } = req.body;
    
    const updatedTask = await Task.update(req.params.id, {
      title,
      description,
      status,
      priority,
      pole,
      assignee,
      due_date
    });
    
    if (!updatedTask) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }
    
    res.json(updatedTask);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de la tâche' });
  }
});

// Route pour supprimer une tâche
router.delete('/:id', async (req, res) => {
  try {
    const deletedTask = await Task.delete(req.params.id);
    
    if (!deletedTask) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }
    
    res.json(deletedTask);
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression de la tâche' });
  }
});

// Route pour récupérer les tâches par utilisateur assigné
router.get('/assignee/:assigneeId', async (req, res) => {
  try {
    const tasks = await Task.getByAssignee(req.params.assigneeId);
    res.json(tasks);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches assignées:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des tâches assignées' });
  }
});

// Route pour récupérer les tâches par utilisateur créateur
router.get('/creator/:creatorId', async (req, res) => {
  try {
    const tasks = await Task.getByCreator(req.params.creatorId);
    res.json(tasks);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches créées:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des tâches créées' });
  }
});

module.exports = router;