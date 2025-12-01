// src/pages/DatabaseTestPage.js
import React, { useState } from 'react';
import '../styles/DatabaseTestPage.css';

const DatabaseTestPage = () => {
  const [testResults, setTestResults] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState(null);

  const testDatabaseConnection = async () => {
    setIsTesting(true);
    setError(null);
    
    try {
      // Test de connexion à la base de données via l'API
      const response = await fetch('/api/test-db-connection');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setTestResults(data);
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors du test de connexion:', err);
    } finally {
      setIsTesting(false);
    }
  };

  const testApiConnection = async () => {
    setIsTesting(true);
    setError(null);
    
    try {
      // Test de connexion à l'API
      const response = await fetch('/api/health');
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const data = await response.json();
      setTestResults({ api: { status: 'OK', ...data } });
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors du test API:', err);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="database-test-container">
      <h1>Test de Connexion à la Base de Données</h1>
      
      <div className="test-controls">
        <button 
          onClick={testDatabaseConnection} 
          disabled={isTesting}
          className="test-button primary"
        >
          {isTesting ? 'Test en cours...' : 'Tester la connexion à la base de données'}
        </button>
        
        <button 
          onClick={testApiConnection} 
          disabled={isTesting}
          className="test-button secondary"
        >
          {isTesting ? 'Test en cours...' : 'Tester la connexion API'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <h3>Erreur:</h3>
          <p>{error}</p>
        </div>
      )}

      {testResults && (
        <div className="results-container">
          <h3>Résultats du test:</h3>
          <pre>{JSON.stringify(testResults, null, 2)}</pre>
        </div>
      )}
      
      <div className="info-section">
        <h3>Informations importantes:</h3>
        <ul>
          <li>Assurez-vous que la variable DATABASE_URL est correctement configurée dans Vercel</li>
          <li>Les tests vérifient la connexion entre le backend Vercel et la base de données PostgreSQL</li>
          <li>Si les tests échouent, vérifiez les logs Vercel pour plus de détails</li>
        </ul>
      </div>
    </div>
  );
};

export default DatabaseTestPage;