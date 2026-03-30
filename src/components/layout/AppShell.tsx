import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { useMerchantStore } from '@/store/useMerchantStore';
import { useNotificationStore } from '@/store/useNotificationStore';

export function AppShell() {
  const seedDemoData = useMerchantStore((state) => state.seedDemoData);
  const seedDemoNotifications = useNotificationStore((state) => state.seedDemoNotifications);

  useEffect(() => {
    seedDemoData();
    seedDemoNotifications();
  }, [seedDemoData, seedDemoNotifications]);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main-content main-content">
        <TopBar />
        <div className="app-content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
