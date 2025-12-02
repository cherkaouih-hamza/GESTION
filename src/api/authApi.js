// src/api/authApi.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL ||
  (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');

const authApi = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        // L'API a répondu avec une erreur
        console.error('Erreur de login:', error.response.data);
        throw new Error(error.response.data.message || error.response.data.error || 'Erreur lors de la connexion');
      } else if (error.request) {
        // Aucune réponse de l'API
        console.error('Erreur de requête:', error.request);
        throw new Error('Impossible de se connecter au serveur. Veuillez vérifier que le serveur est démarré.');
      } else {
        // Erreur de configuration
        console.error('Erreur de configuration:', error.message);
        throw new Error('Erreur de configuration de la requête: ' + error.message);
      }
    }
  },

  register: async (userData) => {
    try {
      console.log('Envoi des données d\'inscription:', userData);
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      console.log('Réponse d\'inscription:', response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Erreur d\'inscription (réponse API):', error.response.data);
        throw new Error(error.response.data.error || error.response.data.message || 'Erreur lors de l\'inscription');
      } else if (error.request) {
        console.error('Erreur d\'inscription (requête):', error.request);
        throw new Error('Impossible de se connecter au serveur. Veuillez vérifier que le serveur est démarré.');
      } else {
        console.error('Erreur d\'inscription (configuration):', error.message);
        throw new Error('Erreur de configuration de la requête: ' + error.message);
      }
    }
  }
};

export default authApi;