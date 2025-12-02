// test-vercel-api.js
require('dotenv').config();
const axios = require('axios');

async function testVercelAPI() {
  console.log('=== TEST DES ENDPOINTS VERCEL ===');
  
  const baseURL = process.env.REACT_APP_API_URL || '/api';
  console.log(`URL de base: ${baseURL}`);

  try {
    // Test de récupération des utilisateurs
    console.log('\\n1. Test GET /users...');
    const usersResponse = await axios.get(`${baseURL}/users`, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Réponse GET /users:', usersResponse.data.length, 'utilisateurs');

    // Test de récupération des tâches
    console.log('\\n2. Test GET /tasks...');
    const tasksResponse = await axios.get(`${baseURL}/tasks`, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Réponse GET /tasks:', tasksResponse.data.length, 'tâches');

    // Test de récupération des pôles
    console.log('\\n3. Test GET /poles...');
    const polesResponse = await axios.get(`${baseURL}/poles`, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Réponse GET /poles:', polesResponse.data.length, 'pôles');

  } catch (error) {
    console.log('❌ Erreur:', error.response ? error.response.data : error.message);
    console.log('Statut:', error.response ? error.response.status : 'N/A');
  }
}

testVercelAPI();