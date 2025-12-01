import { useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';

// This is a simplified implementation for web push notifications
// In a real application, you would connect to a push notification service
const WebPushNotification = () => {
  const { notifications } = useNotifications();

  useEffect(() => {
    // Request notification permission on component mount
    requestNotificationPermission();
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission;
    }
  };

  useEffect(() => {
    // Show browser notifications when new notifications are added
    const newNotification = notifications[0]; // Most recent notification
    if (newNotification && 'Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/favicon.ico', // You would use a proper icon path
        tag: newNotification.id
      });
      
      // Close notification after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);
    }
  }, [notifications]);

  return null; // This component doesn't render anything visible
};

export default WebPushNotification;