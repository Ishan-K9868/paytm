import { CalendarDays, ChevronRight, Menu } from 'lucide-react';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { NotificationBell } from '@/components/NotificationBell';
import { useNotificationStore } from '@/store/useNotificationStore';

const pageTitles: Record<string, string> = {
  '/app/dashboard': 'Dashboard',
  '/app/verify': 'Verify Payment',
  '/app/reconciliation': 'Reconciliation',
  '/app/disputes': 'Disputes',
  '/app/voice': 'Voice Copilot',
  '/app/router-insights': 'Router Insights',
  '/app/end-of-day': 'End of Day',
  '/app/analytics': 'Analytics',
  '/app/notifications': 'Notifications',
  '/app/payment-links': 'Payment Links',
  '/app/settings': 'Settings',
  '/app/action-feed': 'Action Feed',
  '/app/auto-sweep': 'Auto-Sweep Router',
  '/app/vyapar-setu': 'Paytm Vyapar-Setu',
  '/app/voice-negotiator': 'Voice Negotiator',
  '/app/genai-ad-engine': 'GenAI Ad Engine',
};

export function TopBar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const location = useLocation();
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const title = useMemo(() => pageTitles[location.pathname] ?? 'PayAssist', [location.pathname]);

  return (
    <header className="app-topbar">
      <div className="breadcrumb">
        <button aria-label="Open navigation" className="topbar-mobile-menu" onClick={onOpenSidebar} type="button">
          <Menu size={18} />
        </button>
        <span className="breadcrumb-root">Home</span>
        <ChevronRight className="breadcrumb-sep" size={14} />
        <span className="breadcrumb-current">{title}</span>
      </div>

      <div className="app-topbar-actions">
        <div className="app-topbar-date-pill">
          <CalendarDays size={14} />
          <span>Today context</span>
        </div>
        <NotificationBell count={unreadCount} />
      </div>
    </header>
  );
}
