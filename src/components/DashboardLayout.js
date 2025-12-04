import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import '../styles/DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: 'لوحة التحكم', href: '/dashboard', icon: '📊' },
    { name: 'المهام', href: '/tasks', icon: '✅' },
    { name: 'تقرير المهام', href: '/reports', icon: '📈' },
    {
      name: 'صفحة المسؤول',
      href: '/validation',
      icon: '📋',
      roles: ['responsable', 'admin']
    },
    {
      name: 'إدارة المستخدمين',
      href: '/users',
      icon: '👥',
      roles: ['responsable', 'admin']
    },
    {
      name: 'الإعدادات',
      href: '/settings',
      icon: '⚙️',
      roles: ['admin']
    },
    { name: 'الحساب', href: '/profile', icon: '👤' },
  ];

  const filteredNavigation = navigationItems.filter(item => {
    if (item.roles) {
      return item.roles.includes(currentUser?.role);
    }
    return true;
  });

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="dashboard-layout min-h-screen flex flex-col">
      {/* Mobile sidebar - only show on mobile when open */}
      <div className={`mobile-sidebar-container ${sidebarOpen ? 'show' : ''}`}>
        <div className="mobile-overlay" onClick={() => setSidebarOpen(false)}></div>
        <div className={`mobile-sidebar ${sidebarOpen ? 'show' : ''}`}>
          <button
            className="mobile-close-btn"
            onClick={() => setSidebarOpen(false)}
          >
            <span>×</span>
          </button>
          <div className="logo-section">
            <img src="/logo.png" alt="LOGOIACSAS" className="logo-image" />
          </div>
          <nav className="mobile-nav">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span>{item.icon} {item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="sidebar-desktop">
        <div className="flex flex-col flex-shrink-0 px-4 py-6">
          <div className="flex justify-center">
            <img src="/logo.png" alt="LOGOIACSAS" className="logo-image" />
          </div>
          <div className="mt-4 flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10" />
              </div>
              <div className="mr-3 flex-1">
                <p className="user-info">{currentUser?.name || currentUser?.username}</p>
                <p className="user-role capitalize">{currentUser?.role}</p>
              </div>
            </div>
            <div className="flex items-center">
              <NotificationBell />
            </div>
          </div>
        </div>
        <div className="nav-links-container">
          <nav className="px-2 space-y-1">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
              >
                <span>{item.icon} {item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="user-section">
          <div className="flex flex-col items-center px-4 py-3">
            <button
              onClick={logout}
              className="logout-btn"
            >
              خروج
            </button>
            <div className="mt-3 flex items-center justify-center space-x-3">
              <span className="text-sm text-gray-300">IACSAS 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Mobile header */}
        <div className="mobile-header">
          <button
            className="mobile-menu-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            <span>☰</span>
          </button>
          <img src="/logo.png" alt="LOGOIACSAS" className="mobile-logo-image" />
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <button
              onClick={logout}
              className="mobile-logout"
            >
              خروج
            </button>
          </div>
        </div>

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;