// src/pages/DatabaseTestPage.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import '../styles/DatabaseTestPage.css';

const DatabaseTestPage = () => {
  const { currentUser } = useAuth();
  
  // États pour les tests
  const [testResults, setTestResults] = useState({
    connection: { status: null, message: '' },
    users: { status: null, count: 0 },
    tasks: { status: null, count: 0 },
    query: { status: null, result: null, error: '' }
  });
  
  const [loading, setLoading] = useState(false);
  const [customQuery, setCustomQuery] = useState('');

  // Fonction pour tester la connexion
  const testConnection = async () => {
    setLoading(true);
    try {
      // Test de la récupération des utilisateurs
      const usersResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/users`);
      if (usersResponse.ok) {
        const users = await usersResponse.json();
        setTestResults(prev => ({
          ...prev,
          connection: { status: 'success', message: 'Connexion réussie à la base de données' },
          users: { status: 'success', count: users.length }
        }));

        // Ensuite tester les tâches
        const tasksResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/tasks`);
        if (tasksResponse.ok) {
          const tasks = await tasksResponse.json();
          setTestResults(prev => ({
            ...prev,
            tasks: { status: 'success', count: tasks.length }
          }));
        } else {
          setTestResults(prev => ({
            ...prev,
            tasks: { status: 'error', count: 0 }
          }));
        }
      } else {
        setTestResults(prev => ({
          ...prev,
          connection: { status: 'error', message: 'Erreur de connexion à la base de données' },
          users: { status: 'error', count: 0 },
          tasks: { status: 'error', count: 0 }
        }));
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        connection: { status: 'error', message: `Erreur: ${error.message}` },
        users: { status: 'error', count: 0 },
        tasks: { status: 'error', count: 0 }
      }));
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour exécuter une requête personnalisée
  const executeCustomQuery = async () => {
    if (!customQuery.trim()) return;

    setLoading(true);
    setTestResults(prev => ({
      ...prev,
      query: { status: null, result: null, error: '' }
    }));

    try {
      // Pour des raisons de sécurité, nous n'exécutons que des requêtes SELECT
      if (!customQuery.trim().toLowerCase().startsWith('select')) {
        throw new Error('Seules les requêtes SELECT sont autorisées pour des raisons de sécurité');
      }

      // Pour l'instant, nous ferons un test simple basé sur les endpoints existants
      let result;
      if (customQuery.toLowerCase().includes('users')) {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/users`);
        result = await response.json();
      } else if (customQuery.toLowerCase().includes('tasks')) {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/tasks`);
        result = await response.json();
      } else {
        throw new Error('Requête non reconnue. Utilisez "users" ou "tasks"');
      }

      setTestResults(prev => ({
        ...prev,
        query: { status: 'success', result, error: '' }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        query: { status: 'error', result: null, error: error.message }
      }));
    } finally {
      setLoading(false);
    }
  };

  // Vérifier si l'utilisateur est admin
  if (currentUser?.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Accès refusé! </strong>
            <span className="block sm:inline">Vous devez être administrateur pour accéder à cette page.</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-6 px-4 sm:px-6 lg:px-8 database-test-page">
        <div className="database-test-header rounded-xl mb-6">
          <h1 className="text-2xl font-bold text-right">اختبار قاعدة البيانات</h1>
          <p className="text-right opacity-90">اختبار الاتصال بقاعدة البيانات والتحقق من البيانات</p>
        </div>

        {/* Bouton de test de connexion */}
        <div className="test-controls mb-6">
          <button
            onClick={testConnection}
            disabled={loading}
            className={`test-btn ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'جاري الاختبار...' : 'اختبار الاتصال'}
          </button>
        </div>

        {/* Résultats des tests */}
        <div className="test-results-grid">
          {/* Test de connexion */}
          <div className="test-card">
            <h3 className="test-title">اختبار الاتصال</h3>
            <div className={`status-indicator ${testResults.connection.status === 'success' ? 'success' : testResults.connection.status === 'error' ? 'error' : 'pending'}`}>
              {testResults.connection.status === 'success' ? '✓' : testResults.connection.status === 'error' ? '✗' : '?'}
            </div>
            <p className="test-message">{testResults.connection.message || 'لم يتم تشغيل الاختبار'}</p>
          </div>

          {/* Test des utilisateurs */}
          <div className="test-card">
            <h3 className="test-title">اختبار جدول المستخدمين</h3>
            <div className={`status-indicator ${testResults.users.status === 'success' ? 'success' : testResults.users.status === 'error' ? 'error' : 'pending'}`}>
              {testResults.users.status === 'success' ? '✓' : testResults.users.status === 'error' ? '✗' : '?'}
            </div>
            <p className="test-message">
              {testResults.users.status === 'success' 
                ? `عدد المستخدمين: ${testResults.users.count}` 
                : testResults.users.status === 'error' 
                  ? 'خطأ في جلب البيانات' 
                  : 'لم يتم تشغيل الاختبار'}
            </p>
          </div>

          {/* Test des tâches */}
          <div className="test-card">
            <h3 className="test-title">اختبار جدول المهام</h3>
            <div className={`status-indicator ${testResults.tasks.status === 'success' ? 'success' : testResults.tasks.status === 'error' ? 'error' : 'pending'}`}>
              {testResults.tasks.status === 'success' ? '✓' : testResults.tasks.status === 'error' ? '✗' : '?'}
            </div>
            <p className="test-message">
              {testResults.tasks.status === 'success' 
                ? `عدد المهام: ${testResults.tasks.count}` 
                : testResults.tasks.status === 'error' 
                  ? 'خطأ في جلب البيانات' 
                  : 'لم يتم تشغيل الاختبار'}
            </p>
          </div>
        </div>

        {/* Section de requête personnalisée */}
        <div className="custom-query-section mt-8">
          <div className="custom-query-header">
            <div className="custom-query-header-line"></div>
            <h3 className="custom-query-title">استعلام مخصص</h3>
          </div>
          
          <div className="custom-query-form">
            <div className="form-group">
              <label className="form-label">الاستعلام SQL (SELECT فقط)</label>
              <textarea
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                className="form-textarea"
                rows="4"
                placeholder="أدخل استعلام SELECT هنا، مثال: SELECT * FROM users"
                disabled={loading}
              />
            </div>
            
            <button
              onClick={executeCustomQuery}
              disabled={loading || !customQuery.trim()}
              className={`execute-btn ${loading || !customQuery.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'جاري التنفيذ...' : 'تنفيذ الاستعلام'}
            </button>
          </div>

          {/* Affichage des résultats de la requête personnalisée */}
          {testResults.query.status && (
            <div className={`query-result mt-4 p-4 rounded-lg ${testResults.query.status === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <h4 className="font-bold mb-2">نتيجة الاستعلام:</h4>
              {testResults.query.status === 'success' ? (
                <pre className="query-result-content text-sm overflow-x-auto">
                  {JSON.stringify(testResults.query.result, null, 2)}
                </pre>
              ) : (
                <p className="text-red-600">{testResults.query.error}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DatabaseTestPage;