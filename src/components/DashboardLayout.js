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
      name: 'اختبار قاعدة البيانات',
      href: '/database-test',
      icon: '🔬',
      roles: ['admin']
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
                <p className="user-info">{currentUser?.name}</p>
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
              <a href="https://wa.me/212706954855" target="_blank" rel="noopener noreferrer" className="whatsapp-icon">
                <svg className="whatsapp-svg" viewBox="0 0 24 24" width="20" height="20">
                  <path
                    fill="currentColor"
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                  />
                </svg>
              </a>
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