// src/api/taskApi.js
import axios from 'axios';

// Déterminer l'URL de base en fonction de l'environnement
const API_BASE_URL = process.env.REACT_APP_API_URL ||
  (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');

// Créer une instance d'axios avec la configuration de base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor pour ajouter le token d'authentification si nécessaire
api.interceptors.request.use(
  (config) => {
    // Vous pouvez ajouter ici le token d'authentification si votre API l'exige
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Service pour les tâches
export const taskApi = {
  // Récupérer toutes les tâches
  getAllTasks: async () => {
    try {
      const response = await api.get('/resources/tasks');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      throw error;
    }
  },

  // Récupérer une tâche par ID
  getTaskById: async (id) => {
    try {
      const response = await api.get(`/resources/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la tâche:', error);
      throw error;
    }
  },

  // Créer une nouvelle tâche
  createTask: async (taskData) => {
    try {
      const response = await api.post('/resources/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      throw error;
    }
  },

  // Mettre à jour une tâche
  updateTask: async (id, taskData) => {
    try {
      const response = await api.put(`/resources/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
      throw error;
    }
  },

  // Supprimer une tâche
  deleteTask: async (id) => {
    try {
      const response = await api.delete(`/resources/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      throw error;
    }
  },

  // Récupérer les tâches assignées à un utilisateur
  getTasksByAssignee: async (assigneeId) => {
    try {
      const response = await api.get(`/resources/tasks/${assigneeId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches assignées:', error);
      throw error;
    }
  },

  // Récupérer les tâches créées par un utilisateur
  getTasksByCreator: async (creatorId) => {
    try {
      const response = await api.get(`/resources/tasks/${creatorId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches créées:', error);
      throw error;
    }
  },
};

export default taskApi;