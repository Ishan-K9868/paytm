import { AlertTriangle, ArrowUpRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card } from '@/components/ui';
import { PageIntro } from '@/features/shared/PageIntro';
import { useActionFeed } from '@/features/action-feed/useActionFeed';
import { useMerchantStore } from '@/store/useMerchantStore';

const severityAccent = {
  critical: 'error',
  high: 'warning',
  medium: 'cyan',
  low: 'success',
} as const;

export function ActionFeedPage() {
  const profile = useMerchantStore((state) => state.profile);
  const stats = useMerchantStore((state) => state.todayStats);
  const { actions, generatedAt, loading, narrative, pendingCount, takeAction } = useActionFeed({
    profile,
    stats,
    averageTicket: 1200,
    anomalySample: 22000,
  });

  return (
    <PageIntro
      label="Copilot"
      title="Action Feed"
      subtitle="Proactive AI actions across security, reconciliation, procurement, underwriting, and growth. One tap per decision."
      actions={(
        <div className="app-topbar-date-pill">
          <Sparkles size={14} />
          <span>{pendingCount} pending actions</span>
        </div>
      )}
    >
      <div className="dashboard-grid">
        <Card accent="navy" className="dashboard-panel" style={{ gridColumn: 'span 12' }}>
          <div className="dashboard-panel-header">
            <div>
              <div className="section-label">Live Swarm Narrative</div>
              <h2 className="dashboard-panel-title">Today's AI posture</h2>
            </div>
            <div className="app-topbar-date-pill">
              <span>{generatedAt}</span>
            </div>
          </div>
          <p className="page-subtitle" style={{ marginTop: 6 }}>
            {loading ? 'Refreshing action feed from backend modules...' : narrative}
          </p>
        </Card>

        {actions.map((action) => (
          <Card
            key={action.id}
            accent={severityAccent[action.severity]}
            className="dashboard-panel"
            style={{ gridColumn: 'span 6' }}
          >
            <div className="dashboard-panel-header">
              <div>
                <div className="section-label" style={{ color: action.severity === 'critical' ? 'var(--error)' : 'var(--text-muted)' }}>
                  {action.module.replace('_', ' ').toUpperCase()}
                </div>
                <h2 className="dashboard-panel-title">{action.title}</h2>
              </div>
              <span className={`status-pill ${action.status}`}>
                {action.status === 'approved' ? <CheckCircle2 size={12} /> : action.status === 'blocked' ? <AlertTriangle size={12} /> : <ShieldCheck size={12} />}
                {action.status.replace('_', ' ')}
              </span>
            </div>

            <p className="page-subtitle" style={{ marginTop: 4 }}>{action.summary}</p>

            <div
              style={{
                marginTop: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '10px 12px',
                borderRadius: '12px',
                background: 'var(--bg-hover)',
              }}
            >
              <span className="dashboard-row-meta">{action.metricLabel}</span>
              <strong className="dashboard-row-amount">{action.metricValue}</strong>
            </div>

            <div className="dashboard-row-meta" style={{ marginTop: 12 }}>
              {action.recommendation}
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
              <Button onClick={() => takeAction(action.id, 'approved')} type="button">
                {action.primaryAction}
              </Button>
              {action.secondaryAction ? (
                <Button onClick={() => takeAction(action.id, 'blocked')} type="button" variant="secondary">
                  {action.secondaryAction}
                </Button>
              ) : null}
              <Link className="dashboard-inline-link" to={action.route}>
                Open module <ArrowUpRight size={14} />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </PageIntro>
  );
}
