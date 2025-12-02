// test-inscription.js
// Script pour tester l'inscription directement avec node-fetch intégré

const testData = {
  name: 'Test User',
  email: 'testuser@example.com',
  phone: '+212612345678',
  password: 'password123',
  confirmPassword: 'password123'
};

console.log('Test des données d\'inscription :', testData);

// Vérifions si les données sont valides selon la logique frontend
if (testData.password !== testData.confirmPassword) {
  console.log('❌ Erreur: Les mots de passe ne correspondent pas');
} else if (testData.password.length < 6) {
  console.log('❌ Erreur: Le mot de passe doit contenir au moins 6 caractères');
} else {
  console.log('✅ Validation frontend des données d\'inscription réussie');
}

// Testons les champs requis
if (!testData.name || !testData.email || !testData.password) {
  console.log('❌ Erreur: Les champs nom, email et mot de passe sont requis');
} else {
  console.log('✅ Tous les champs requis sont présents');
}