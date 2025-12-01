import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: 'لوحة التحكم', href: '/dashboard', icon: '📊' },
    { name: 'المهام', href: '/tasks', icon: '✅' },
    {
      name: 'تقرير المهام',
      href: '/reports',
      icon: '📈',
      roles: ['responsable', 'admin']
    },
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
      {sidebarOpen && (
        <div className="mobile-sidebar-container block md:hidden">
          <div className="mobile-overlay" onClick={() => setSidebarOpen(false)}></div>
          <div className="mobile-sidebar">
            <button
              className="mobile-close-btn"
              onClick={() => setSidebarOpen(false)}
            >
              <span>×</span>
            </button>
            <div className="logo-section">
              <h2 className="logo-text">نظام المتابعة</h2>
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
      )}

      {/* Desktop sidebar */}
      <div className="sidebar-desktop hidden md:flex md:flex-col">
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <div className="flex items-center justify-center flex-shrink-0 px-4 py-6">
            <h1 className="logo-text">نظام المتابعة</h1>
          </div>
          <nav className="flex-1 px-2 space-y-1">
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
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10" />
            </div>
            <div className="mr-3 flex-1">
              <p className="user-info">{currentUser?.name}</p>
              <p className="user-role capitalize">{currentUser?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="logout-btn mt-3"
          >
            خروج
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Mobile header */}
        <div className="mobile-header md:hidden">
          <button
            className="mobile-menu-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            <span>☰</span>
          </button>
          <h1 className="mobile-logo">نظام المتابعة</h1>
          <button
            onClick={logout}
            className="mobile-logout"
          >
            خروج
          </button>
        </div>

        <main className="main-content flex-1 md:mr-64">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;