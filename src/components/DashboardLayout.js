import React, { useState, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import '../styles/DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Memoize navigation items to avoid recreating on each render
  const navigationItems = useMemo(() => [
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
  ], []);

  // Memoize filtered navigation to prevent unnecessary recalculations
  const filteredNavigation = useMemo(() => {
    if (!currentUser) return [];

    return navigationItems.filter(item => {
      if (item.roles) {
        return item.roles.includes(currentUser?.role);
      }
      return true;
    });
  }, [navigationItems, currentUser]);

  // Memoize active state function
  const isActive = useCallback((path) => {
    return location.pathname === path;
  }, [location.pathname]);

  // Close sidebar when clicking on overlay
  const handleOverlayClick = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Close sidebar and navigate
  const handleNavClick = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  return (
    <div className="dashboard-layout min-h-screen flex flex-col">
      {/* Mobile sidebar - only show on mobile when open */}
      <div className={`mobile-sidebar-container ${sidebarOpen ? 'show' : ''} block md:hidden`}>
        <div className="mobile-overlay" onClick={handleOverlayClick}></div>
        <div className="mobile-sidebar sidebar-animated">
          <button
            className="mobile-close-btn"
            onClick={handleOverlayClick}
            aria-label="إغلاق القائمة"
          >
            <span>×</span>
          </button>
          <div className="logo-section">
            <img
              src="/logo.png"
              alt="LOGOIACSAS"
              className="logo-image"
              loading="lazy"
            />
          </div>
          <nav className="mobile-nav">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                onClick={handleNavClick}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                <span className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="sidebar-desktop hidden md:flex md:flex-col sidebar-animated">
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <div className="flex items-center justify-center flex-shrink-0 px-4 py-6">
            <img
              src="/logo.png"
              alt="LOGOIACSAS"
              className="logo-image"
              loading="lazy"
            />
          </div>
          <nav className="flex-1 px-2 space-y-1">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                <span className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="user-section">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10" />
              </div>
              <div className="mr-3 flex-1">
                <p className="user-info">{currentUser?.name}</p>
                <p className="user-role capitalize">{currentUser?.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell />
              <button
                onClick={logout}
                className="logout-btn"
                aria-label="تسجيل الخروج"
              >
                خروج
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Mobile header */}
        <div className="mobile-header md:hidden">
          <button
            className="mobile-menu-toggle"
            onClick={toggleSidebar}
            aria-label="فتح القائمة"
          >
            <span>☰</span>
          </button>
          <img
            src="/logo.png"
            alt="LOGOIACSAS"
            className="mobile-logo-image"
            loading="lazy"
          />
          <div className="flex items-center gap-3">
            <NotificationBell />
            <button
              onClick={logout}
              className="mobile-logout"
              aria-label="تسجيل الخروج"
            >
              خروج
            </button>
          </div>
        </div>

        <main className="main-content flex-1 md:mr-64">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;