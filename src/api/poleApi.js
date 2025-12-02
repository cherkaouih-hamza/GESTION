// src/api/poleApi.js
import axios from 'axios';

// Déterminer l'URL de base en fonction de l'environnement
const API_BASE_URL = process.env.REACT_APP_API_URL ||
  (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');

export const poleApi = {
  // Récupérer tous les pôles
  getPoles: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/poles/poles`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des pôles:', error);
      throw error;
    }
  },

  // Créer un nouveau pôle
  createPole: async (poleData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/poles/poles`, poleData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du pôle:', error);
      throw error;
    }
  },

  // Mettre à jour un pôle
  updatePole: async (id, poleData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/poles/poles/${id}`, poleData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du pôle:', error);
      throw error;
    }
  },

  // Supprimer (désactiver) un pôle
  deletePole: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/poles/poles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression du pôle:', error);
      throw error;
    }
  }
};