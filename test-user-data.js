// test-user-data.js
require('dotenv').config();
const axios = require('axios');

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

async function testUserData() {
  try {
    console.log('Test de récupération des utilisateurs...');
    
    const response = await axios.get(`${API_BASE_URL}/user-manager`);
    console.log('Données des utilisateurs:', response.data);
    
    if (response.data && response.data.length > 0) {
      console.log('\nPremier utilisateur:', response.data[0]);
      console.log('\nClés de l\'objet utilisateur:', Object.keys(response.data[0]));
      console.log('\nValeur de is_active:', response.data[0].is_active);
    }
  } catch (error) {
    console.error('Erreur lors du test:', error.response?.data || error.message);
  }
}

testUserData();