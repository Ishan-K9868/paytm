import { motion } from 'motion/react';
import {
  BarChart3,
  Brain,
  CircleDollarSign,
  GitMerge,
  LayoutDashboard,
  Link2,
  LogOut,
  Mic,
  Scale,
  Search,
  Settings,
  Sparkles,
  Sunset,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { NotificationBell } from '@/components/NotificationBell';
import { useAuth } from '@/hooks/useAuth';
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
      { icon: Sparkles, label: 'Action Feed', path: '/app/action-feed' },
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
    section: 'AI Modules',
    items: [
      { icon: CircleDollarSign, label: 'Auto-Sweep Router', path: '/app/auto-sweep' },
      { icon: GitMerge, label: 'Vyapar-Setu', path: '/app/vyapar-setu' },
      { icon: Mic, label: 'Voice Negotiator', path: '/app/voice-negotiator', voice: true },
      { icon: Brain, label: 'GenAI Ad Engine', path: '/app/genai-ad-engine' },
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

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const profile = useMerchantStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const { logout } = useAuth();

  return (
    <aside className={`app-sidebar sidebar ${isOpen ? 'open' : ''}`.trim()}>
      <Link className="app-sidebar-brand" onClick={onClose} to="/">
        <div className="app-logo-mark">P</div>
        <div>
          <div className="app-logo-name">PayAssist</div>
          <div className="app-badge">built on Paytm</div>
        </div>
      </Link>

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
                <span key={item.path} onClick={onClose}><NavItem item={item} /></span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="app-sidebar-bottom">
        <div className="app-sidebar-utility-row">
          <NotificationBell count={unreadCount} sidebar />
          <Link aria-label="Open settings" className="sidebar-utility-link" onClick={onClose} to="/app/settings">
            <Settings size={18} />
          </Link>
        </div>
        <div className="app-user-row">
          <div className="app-user-avatar">{user?.displayName.slice(0, 1) ?? 'M'}</div>
          <div className="app-user-copy">
            <div className="app-user-name">{user?.displayName ?? 'Merchant demo'}</div>
            <div className="app-user-email">{user?.email ?? 'demo@payassist.app'}</div>
          </div>
          <button aria-label="Log out" className="sidebar-utility-link" onClick={() => void logout()} type="button">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
