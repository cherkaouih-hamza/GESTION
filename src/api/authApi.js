// src/api/authApi.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL ||
  (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');

const authApi = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        // L'API a répondu avec une erreur
        throw new Error(error.response.data.message || 'Erreur lors de la connexion');
      } else if (error.request) {
        // Aucune réponse de l'API
        throw new Error('Impossible de se connecter au serveur. Veuillez vérifier que le serveur est démarré.');
      } else {
        // Erreur de configuration
        throw new Error('Erreur de configuration de la requête');
      }
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, userData);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.error || 'Erreur lors de l\'inscription');
      } else if (error.request) {
        throw new Error('Impossible de se connecter au serveur. Veuillez vérifier que le serveur est démarré.');
      } else {
        throw new Error('Erreur de configuration de la requête');
      }
    }
  }
};

export default authApi;