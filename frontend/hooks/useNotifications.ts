import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../lib/api-client';
import { useWebSocket } from './useWebSocket';
import { useAuth } from './useAuth';

export type NotificationType = 
  | 'price_alert'
  | 'auction_update'
  | 'new_message'
  | 'bid_placed'
  | 'auction_ended'
  | 'dispute_update'
  | 'review_received'
  | 'saved_search_match';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { subscribe } = useWebSocket();

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await apiClient.getNotifications();
      setNotifications(response);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch notifications'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await apiClient.markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to mark notification as read');
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await apiClient.markAllNotificationsAsRead();
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to mark all notifications as read');
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await apiClient.deleteNotification(notificationId);
      setNotifications(prev =>
        prev.filter(notification => notification.id !== notificationId)
      );
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete notification');
    }
  }, []);

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribe('notification', (data: Notification) => {
      setNotifications(prev => [data, ...prev]);
    });

    return () => {
      unsubscribe();
    };
  }, [user, subscribe]);

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications: fetchNotifications,
  };
} 