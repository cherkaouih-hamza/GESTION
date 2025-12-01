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
    <div className="dashboard-layout min-h-screen bg-gray-100 flex flex-col">
      {/* Mobile sidebar */}
      <div className={`mobile-sidebar-container fixed inset-0 z-40 flex ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="mobile-overlay" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex-1 flex max-w-xs w-full bg-indigo-700 mobile-sidebar mobile-sidebar-content">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="mobile-menu-close ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">إغلاق</span>
              <span className="text-white text-xl">×</span>
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h2 className="text-white text-lg font-bold">نظام المتابعة</h2>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive(item.href)
                      ? 'bg-indigo-800 text-white'
                      : 'text-indigo-100 hover:bg-indigo-600'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="ml-3">{item.icon} {item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-indigo-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-center flex-shrink-0 px-4">
              <h1 className="text-white text-xl font-bold text-center">نظام المتابعة</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive(item.href)
                      ? 'bg-indigo-800 text-white'
                      : 'text-indigo-100 hover:bg-indigo-600'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <span className="ml-3">{item.icon} {item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex pb-4 px-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-white">{currentUser?.name}</p>
                <p className="text-xs font-medium text-indigo-200 capitalize">{currentUser?.role}</p>
              </div>
              <button
                onClick={logout}
                className="mr-auto bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
              >
                خروج
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:dir-ltr md:pr-64 flex flex-col flex-1">
        {/* Mobile header */}
        <div className="md:hidden">
          <div className="flex items-center justify-between bg-indigo-700 px-4 py-3">
            <button
              className="mobile-menu-toggle ml-2 flex items-center justify-center h-10 w-10 rounded-md text-indigo-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="text-white text-xl">☰</span>
            </button>
            <h1 className="text-white text-lg font-bold">نظام المتابعة</h1>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              خروج
            </button>
          </div>
        </div>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;