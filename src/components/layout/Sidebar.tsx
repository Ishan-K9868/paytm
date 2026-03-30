import { motion } from 'motion/react';
import {
  BarChart3,
  GitMerge,
  LayoutDashboard,
  Link2,
  LogOut,
  Mic,
  Scale,
  Search,
  Settings,
  Sunset,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { NotificationBell } from '@/components/NotificationBell';
import { useAuthStore } from '@/store/useAuthStore';
import { useMerchantStore } from '@/store/useMerchantStore';
import { useNotificationStore } from '@/store/useNotificationStore';

interface NavItemConfig {
  icon: LucideIcon;
  label: string;
  path: string;
  voice?: boolean;
}

const navConfig: Array<{ section: string; items: NavItemConfig[] }> = [
  {
    section: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/app/dashboard' },
      { icon: BarChart3, label: 'Analytics', path: '/app/analytics' },
    ],
  },
  {
    section: 'Payments',
    items: [
      { icon: Search, label: 'Verify Payment', path: '/app/verify' },
      { icon: Link2, label: 'Payment Links', path: '/app/payment-links' },
      { icon: Zap, label: 'Router Insights', path: '/app/router-insights' },
    ],
  },
  {
    section: 'Operations',
    items: [
      { icon: GitMerge, label: 'Reconciliation', path: '/app/reconciliation' },
      { icon: Sunset, label: 'End of Day', path: '/app/end-of-day' },
      { icon: Scale, label: 'Disputes', path: '/app/disputes' },
    ],
  },
  {
    section: 'Copilot',
    items: [{ icon: Mic, label: 'Voice Copilot', path: '/app/voice', voice: true }],
  },
];

function NavItem({ item }: { item: NavItemConfig }) {
  const location = useLocation();
  const isActive = location.pathname === item.path;
  const Icon = item.icon;

  return (
    <Link className={`nav-item ${isActive ? 'active' : ''} ${item.voice ? 'voice' : ''}`} to={item.path}>
      <motion.div whileHover={{ x: 2 }} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}>
        {isActive ? <motion.span className="active-bar" layoutId="activeBar" /> : null}
        <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
        <span className="nav-label">{item.label}</span>
      </motion.div>
    </Link>
  );
}

export function Sidebar() {
  const profile = useMerchantStore((state) => state.profile);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  return (
    <aside className="app-sidebar sidebar">
      <div className="app-sidebar-brand">
        <div className="app-logo-mark">P</div>
        <div>
          <div className="app-logo-name">PayAssist</div>
          <div className="app-badge">built on Paytm</div>
        </div>
      </div>

      <div className="app-merchant-card">
        <div className="app-merchant-avatar">{profile?.businessName.slice(0, 1) ?? 'P'}</div>
        <div>
          <div className="app-merchant-name">{profile?.businessName ?? 'Merchant workspace'}</div>
          <div className="app-merchant-city">{profile?.city ?? 'No city yet'}</div>
        </div>
      </div>

      <div className="app-sidebar-nav">
        {navConfig.map((group) => (
          <div className="app-nav-group" key={group.section}>
            <div className="app-nav-section section-header">{group.section}</div>
            <div className="app-nav-list">
              {group.items.map((item) => (
                <NavItem item={item} key={item.path} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="app-sidebar-bottom">
        <div className="app-sidebar-utility-row">
          <NotificationBell count={unreadCount} sidebar />
          <Link aria-label="Open settings" className="sidebar-utility-link" to="/app/settings">
            <Settings size={18} />
          </Link>
        </div>
        <div className="app-user-row">
          <div className="app-user-avatar">{user?.displayName.slice(0, 1) ?? 'M'}</div>
          <div className="app-user-copy">
            <div className="app-user-name">{user?.displayName ?? 'Merchant demo'}</div>
            <div className="app-user-email">{user?.email ?? 'demo@payassist.app'}</div>
          </div>
          <button aria-label="Log out" className="sidebar-utility-link" onClick={logout} type="button">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
