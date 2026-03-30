import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotificationBell({ count, sidebar = false }: { count: number; sidebar?: boolean }) {
  return (
    <Link
      aria-label={`Open notifications${count > 0 ? `, ${count} unread` : ''}`}
      className="notif-bell-btn"
      style={sidebar ? { width: '40px', height: '40px' } : undefined}
      to="/app/notifications"
    >
      <Bell size={18} />
      {count > 0 ? <span className="notif-badge">{count > 99 ? '99+' : count}</span> : null}
    </Link>
  );
}
