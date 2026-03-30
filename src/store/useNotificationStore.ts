import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
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
      seedDemoNotifications: () => {
        if (get().notifications.length > 0) {
          set({ unreadCount: get().notifications.filter((item) => !item.read).length });
          return;
        }
        set({
          notifications: demoNotifications,
          unreadCount: demoNotifications.filter((item) => !item.read).length,
        });
      },
    }),
    { name: 'payassist-notifications' }
  )
);
