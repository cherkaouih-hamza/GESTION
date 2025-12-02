// src/components/DatabaseTestComponent.js
import React, { useState } from 'react';

const DatabaseTestComponent = () => {
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
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800">اختبار قاعدة البيانات</h3>
        </div>

        <div className="test-controls space-x-4 space-y-4 mb-6">
          <button
            onClick={testDatabaseConnection}
            disabled={isTesting}
            className="test-button bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {isTesting ? 'Test en cours...' : 'Tester la connexion DB'}
          </button>

          <button
            onClick={testApiConnection}
            disabled={isTesting}
            className="test-button bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {isTesting ? 'Test en cours...' : 'Tester la connexion API'}
          </button>

          <button
            onClick={testCreateTask}
            disabled={isTesting}
            className="test-button bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {isTesting ? 'Création en cours...' : 'Tester l\'ajout de tâche'}
          </button>
        </div>

        {error && (
          <div className="error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            <h3 className="font-bold">Erreur:</h3>
            <p>{error}</p>
          </div>
        )}

        {testResults && (
          <div className="results-container bg-gray-100 p-4 rounded-lg mb-4">
            <h3 className="font-bold text-gray-800">Résultats du test:</h3>
            <pre className="text-sm text-gray-700 bg-white p-2 rounded overflow-auto">{JSON.stringify(testResults, null, 2)}</pre>
          </div>
        )}

        {taskId && (
          <div className="success-message bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            <h3 className="font-bold">Tâche créée avec succès!</h3>
            <p>ID de la tâche: {taskId}</p>
          </div>
        )}

        <div className="info-section bg-blue-50 p-4 rounded-lg">
          <h3 className="font-bold text-blue-800">Informations importantes:</h3>
          <ul className="list-disc list-inside text-blue-700 space-y-1 mt-2">
            <li>Assurez-vous que la variable DATABASE_URL est correctement configurée dans Vercel</li>
            <li>Les tests vérifient la connexion entre le backend Vercel et la base de données PostgreSQL</li>
            <li>Si les tests échouent, vérifiez les logs Vercel pour plus de détails</li>
            <li>Le test d'ajout de tâche vérifie la fonctionnalité complète d'écriture dans la base de données</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTestComponent;