import { create } from 'zustand';
import { demoNotifications } from '@/data/demoAppData';
import type { AppNotification } from '@/types/merchant.types';

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (notification: AppNotification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  seedDemoNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) =>
    set((state) => {
      const notifications = [notification, ...state.notifications];
      return {
        notifications,
        unreadCount: notifications.filter((item) => !item.read).length,
      };
    }),
  markRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((item) =>
        item.id === id ? { ...item, read: true } : item
      );
      return {
        notifications,
        unreadCount: notifications.filter((item) => !item.read).length,
      };
    }),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((item) => ({ ...item, read: true })),
      unreadCount: 0,
    })),
  seedDemoNotifications: () =>
    set({
      notifications: demoNotifications,
      unreadCount: demoNotifications.filter((item) => !item.read).length,
    }),
}));
