import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { CustomCursor } from '@/components/CustomCursor';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { useMerchantStore } from '@/store/useMerchantStore';
import { useNotificationStore } from '@/store/useNotificationStore';

export function AppShell() {
  const seedDemoData = useMerchantStore((state) => state.seedDemoData);
  const seedDemoNotifications = useNotificationStore((state) => state.seedDemoNotifications);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    seedDemoData();
    seedDemoNotifications();
  }, [seedDemoData, seedDemoNotifications]);

  return (
    <div className="app-shell">
      <CustomCursor />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="app-main-content main-content">
        <TopBar onOpenSidebar={() => setIsSidebarOpen(true)} />
        <div className="app-content-area">
          <Outlet />
        </div>
      </div>
      {isSidebarOpen ? <button aria-label="Close navigation overlay" className="app-sidebar-overlay" onClick={() => setIsSidebarOpen(false)} type="button" /> : null}
    </div>
  );
}
