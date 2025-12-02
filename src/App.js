import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import AccountPendingPage from './pages/AccountPendingPage';
import WebPushNotification from './components/WebPushNotification';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import ValidationPage from './pages/ValidationPage';
import UsersPage from './pages/UsersPage';
import ProfilePage from './pages/ProfilePage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import DatabaseTestPage from './pages/DatabaseTestPage';
import './styles/App.css';

function App() {
  return (
    <div className="App" dir="rtl">
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/account-pending" element={<AccountPendingPage />} />
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
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute allowedRoles={['responsable', 'admin']}>
                      <UsersPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/reports" element={
                  <ProtectedRoute allowedRoles={['responsable', 'admin']}>
                    <ReportsPage />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
                <Route path="/database-test" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DatabaseTestPage />
                  </ProtectedRoute>
                } />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
              <WebPushNotification />
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </div>
  );
}

export default App;