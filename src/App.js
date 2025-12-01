import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import ValidationPage from './pages/ValidationPage';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';
import './styles/App.css';

function App() {
  return (
    <div className="App" dir="rtl">
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tasks" 
                element={
                  <ProtectedRoute>
                    <TasksPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/validation" 
                element={
                  <ProtectedRoute allowedRoles={['responsable', 'admin']}>
                    <ValidationPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
            <WhatsAppFloatingButton />
          </div>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;