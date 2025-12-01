import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

const NotificationBell = () => {
  const { notifications, unreadCount, markAllAsRead, removeNotification } = useNotifications();
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    setIsOpen(false);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      removeNotification(notification.id);
    }
  };

  // Only show notifications for the current user
  const userNotifications = notifications.filter(
    notification => !notification.userId || notification.userId === currentUser?.id
  );

  const unreadUserNotifications = userNotifications.filter(n => !n.read);

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={toggleNotifications}
        className="relative p-2 rounded-full text-gray-700 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="إشعارات"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          ></path>
        </svg>
        {unreadUserNotifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadUserNotifications.length}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 border border-gray-200" style={{ transform: 'translateX(-50%)' }}>
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">الإشعارات</h3>
              {unreadUserNotifications.length > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-indigo-600 hover:text-indigo-900"
                >
                  تعليم الكل كمقروء
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {userNotifications.length > 0 ? (
              userNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                    notification.read ? 'bg-white hover:bg-gray-50' : 'bg-blue-50 hover:bg-blue-100'
                  }`}
                >
                  <div className="flex justify-between">
                    <p className={`font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    {new Date(notification.timestamp).toLocaleString('ar-MA')}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                لا توجد إشعارات جديدة
              </div>
            )}
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default NotificationBell;