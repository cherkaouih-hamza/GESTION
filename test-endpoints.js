// test-endpoints.js
require('dotenv').config();
const axios = require('axios');

async function testEndpoints() {
  console.log('=== TEST DES ENDPOINTS ===');
  
  const baseURL = process.env.REACT_APP_API_URL || '/api';
  console.log(`URL de base: ${baseURL}`);

  try {
    // Test de l'inscription
    console.log('\\n1. Test POST /auth/register...');
    const registerResponse = await axios.post(`${baseURL}/auth/register`, {
      username: 'test_user',
      email: 'test@example.com',
      password: 'test123',
      role: 'utilisateur'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Réponse POST /auth/register:', registerResponse.data);
  } catch (error) {
    console.log('❌ Erreur POST /auth/register:', error.response ? error.response.data : error.message);
    console.log('Statut:', error.response ? error.response.status : 'N/A');
  }
  
  try {
    // Test du login
    console.log('\\n2. Test POST /auth/login...');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Réponse POST /auth/login:', loginResponse.data);
  } catch (error) {
    console.log('❌ Erreur POST /auth/login:', error.response ? error.response.data : error.message);
    console.log('Statut:', error.response ? error.response.status : 'N/A');
  }
  
  try {
    // Test de récupération des utilisateurs
    console.log('\\n3. Test GET /resources/users...');
    const usersResponse = await axios.get(`${baseURL}/resources/users`, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Réponse GET /resources/users:', usersResponse.data.length, 'utilisateurs');
  } catch (error) {
    console.log('❌ Erreur GET /resources/users:', error.response ? error.response.data : error.message);
    console.log('Statut:', error.response ? error.response.status : 'N/A');
  }
}

testEndpoints();