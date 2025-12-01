// src/pages/DatabaseTestPage.js
import React, { useState } from 'react';
import '../styles/DatabaseTestPage.css';

const DatabaseTestPage = () => {
  const [testResults, setTestResults] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState(null);
  const [taskId, setTaskId] = useState(null);

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

  const testCreateTask = async () => {
    setIsTesting(true);
    setError(null);

    try {
      // Test de création d'une tâche
      const taskData = {
        title: 'Test de tâche - ' + new Date().toISOString(),
        description: 'Tâche de test créée depuis la page de test',
        status: 'pending',
        priority: 'medium',
        pole: 'technique',
        assignee: 'admin',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Une semaine à partir de maintenant
        created_by: 'admin'
      };

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${response.status}: ${errorData.error || 'Erreur inconnue'}`);
      }

      const data = await response.json();
      setTaskId(data.id || data.id);
      setTestResults({
        message: 'Tâche créée avec succès',
        task: data,
        ...testResults
      });
    } catch (err) {
      setError(`Erreur lors de la création de la tâche: ${err.message}`);
      console.error('Erreur lors de la création de la tâche:', err);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="database-test-container">
      <h1>Test de Connexion et Fonctionnalités de la Base de Données</h1>

      <div className="test-controls">
        <button
          onClick={testDatabaseConnection}
          disabled={isTesting}
          className="test-button primary"
        >
          {isTesting ? 'Test en cours...' : 'Tester la connexion DB'}
        </button>

        <button
          onClick={testApiConnection}
          disabled={isTesting}
          className="test-button secondary"
        >
          {isTesting ? 'Test en cours...' : 'Tester la connexion API'}
        </button>

        <button
          onClick={testCreateTask}
          disabled={isTesting}
          className="test-button success"
        >
          {isTesting ? 'Création en cours...' : 'Tester l\'ajout de tâche'}
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

      {taskId && (
        <div className="success-message">
          <h3>Tâche créée avec succès!</h3>
          <p>ID de la tâche: {taskId}</p>
        </div>
      )}

      <div className="info-section">
        <h3>Informations importantes:</h3>
        <ul>
          <li>Assurez-vous que la variable DATABASE_URL est correctement configurée dans Vercel</li>
          <li>Les tests vérifient la connexion entre le backend Vercel et la base de données PostgreSQL</li>
          <li>Si les tests échouent, vérifiez les logs Vercel pour plus de détails</li>
          <li>Le test d'ajout de tâche vérifie la fonctionnalité complète d'écriture dans la base de données</li>
        </ul>
      </div>
    </div>
  );
};

export default DatabaseTestPage;