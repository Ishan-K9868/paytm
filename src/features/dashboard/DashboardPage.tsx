import { Activity, AlertTriangle, ArrowUpRight, CircleDollarSign, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AmountDisplay } from '@/components/AmountDisplay';
import { Card } from '@/components/ui/Card';
import { demoReconciliationSummary, demoTransactions } from '@/data/demoAppData';
import { PageIntro } from '@/features/shared/PageIntro';
import { useMerchantStore } from '@/store/useMerchantStore';
import { useNotificationStore } from '@/store/useNotificationStore';

export function DashboardPage() {
  const profile = useMerchantStore((state) => state.profile);
  const stats = useMerchantStore((state) => state.todayStats);
  const healthScore = useMerchantStore((state) => state.healthScore);
  const notifications = useNotificationStore((state) => state.notifications);

  return (
    <PageIntro
      label="Overview"
      title={`Good evening, ${profile?.businessName ?? 'merchant'}`}
      subtitle="This is the first execution slice: routed shell, live dashboard skeleton, and all core modules wired for the PayAssist app build."
    >
      <div className="dashboard-grid">
        <Card accent="cyan" className="stat-card" data-value="01">
          <div className="stat-label">Total Collected</div>
          <div className="stat-value"><AmountDisplay amount={stats?.totalCollected ?? 0} size="xl" /></div>
          <div className="stat-trend"><CircleDollarSign size={14} /> 184 payment events synced today</div>
        </Card>

        <Card accent="error" className="stat-card" data-value="02">
          <div className="stat-label">Pending Disputes</div>
          <div className="stat-value">{stats?.pendingDisputes ?? 0}</div>
          <div className="stat-trend"><AlertTriangle size={14} /> 1 needs action before tomorrow</div>
        </Card>

        <Card accent="success" className="stat-card" data-value="03">
          <div className="stat-label">Settlement Status</div>
          <div className="stat-value"><AmountDisplay amount={stats?.totalSettled ?? 0} size="xl" /></div>
          <div className="stat-trend"><ShieldCheck size={14} /> Rs. 4,840 still moving through settlement</div>
        </Card>

        <Card accent="navy" className="stat-card" data-value="04">
          <div className="stat-label">Payment Health Score</div>
          <div className="stat-value">{healthScore ?? 0}</div>
          <div className="stat-trend"><Activity size={14} /> Success rate is holding at {stats?.successRate ?? 0}%</div>
        </Card>

        <Card accent="cyan" className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <div className="section-label">Recent Flow</div>
              <h2 className="dashboard-panel-title">Latest payment pulse</h2>
            </div>
            <Link className="dashboard-inline-link" to="/app/verify">Open verifier <ArrowUpRight size={14} /></Link>
          </div>
          <div className="dashboard-list">
            {Object.values(demoTransactions).map((transaction) => (
              <div className="dashboard-list-row" key={transaction.orderId}>
                <div>
                  <div className="dashboard-row-title">{transaction.paymentMode} · {transaction.responseMsg}</div>
                  <div className="dashboard-row-meta">{transaction.orderId}</div>
                </div>
                <div className="dashboard-row-amount">Rs. {transaction.txnAmount}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card accent="warning" className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <div className="section-label">Attention</div>
              <h2 className="dashboard-panel-title">Operational pressure points</h2>
            </div>
          </div>
          <div className="dashboard-alert-stack">
            {notifications.slice(0, 3).map((notification) => (
              <div className="dashboard-alert-card" key={notification.id}>
                <div>
                  <div className="dashboard-row-title">{notification.title}</div>
                  <div className="dashboard-row-meta">{notification.message}</div>
                </div>
                <div className="dashboard-row-amount">{notification.urgency}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card accent="success" className="dashboard-panel dashboard-wide-panel">
          <div className="dashboard-panel-header">
            <div>
              <div className="section-label">Close Day</div>
              <h2 className="dashboard-panel-title">Tonight's operational snapshot</h2>
            </div>
          </div>
          <div className="snapshot-grid">
            <div className="snapshot-metric">
              <span className="snapshot-label">Anomalies</span>
              <strong>{demoReconciliationSummary.anomalyCount}</strong>
            </div>
            <div className="snapshot-metric">
              <span className="snapshot-label">Collected</span>
              <strong><AmountDisplay amount={demoReconciliationSummary.totalCollected} size="lg" /></strong>
            </div>
            <div className="snapshot-metric">
              <span className="snapshot-label">Settled</span>
              <strong><AmountDisplay amount={demoReconciliationSummary.totalSettled} size="lg" /></strong>
            </div>
            <div className="snapshot-metric">
              <span className="snapshot-label">Delta</span>
              <strong><AmountDisplay amount={demoReconciliationSummary.delta} size="lg" type="debit" /></strong>
            </div>
          </div>
        </Card>
      </div>
    </PageIntro>
  );
}
