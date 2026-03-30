import { PageIntro } from '@/features/shared/PageIntro';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotificationStore } from '@/store/useNotificationStore';

export function NotificationsPage() {
  const notifications = useNotificationStore((state) => state.notifications);
  const markAllRead = useNotificationStore((state) => state.markAllRead);
  const markRead = useNotificationStore((state) => state.markRead);

  return (
    <PageIntro
      actions={<Button onClick={markAllRead} type="button" variant="secondary">Mark all read</Button>}
      label="Inbox"
      subtitle="This routed page stores notification state locally for the hackathon build, so the demo stays stable without backend setup."
      title="Notifications"
    >
      <div className="filter-pill-row" style={{ marginBottom: 16 }}>
        {['ALL', 'UNREAD', 'ALERTS', 'INFO'].map((item) => <button className={`filter-pill ${item === 'ALL' ? 'active' : ''}`} key={item} type="button">{item}</button>)}
      </div>
      <Card accent="cyan" className="notifications-shell">
        {notifications.map((notification) => (
          <button className={`notif-item ${notification.read ? '' : 'unread'}`.trim()} key={notification.id} onClick={() => markRead(notification.id)} type="button">
            <div className="notif-icon-wrap">{notification.urgency.slice(0, 1).toUpperCase()}</div>
            <div className="notif-content">
              <div className="notif-title">{notification.title}</div>
              <div className="notif-message">{notification.message}</div>
              <div className="notif-time">{notification.timestamp}</div>
            </div>
          </button>
        ))}
      </Card>
    </PageIntro>
  );
}
