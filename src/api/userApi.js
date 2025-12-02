// src/api/userApi.js
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

// Service pour les utilisateurs
export const userApi = {
  // Récupérer tous les utilisateurs
  getAllUsers: async () => {
    try {
      const response = await api.get('/resources/users');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  },

  // Récupérer un utilisateur par ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/resources/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      throw error;
    }
  },

  // Récupérer un utilisateur par email
  getUserByEmail: async (email) => {
    try {
      const response = await api.get(`/resources/users/${email}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      throw error;
    }
  },

  // Créer un nouvel utilisateur
  createUser: async (userData) => {
    try {
      const response = await api.post('/resources/users', userData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  },

  // Mettre à jour un utilisateur
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/resources/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  },

  // Supprimer un utilisateur
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/resources/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  },
};

export default userApi;