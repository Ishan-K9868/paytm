import { CheckCircle2, CircleDollarSign, Sparkles } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { PageIntro } from '@/features/shared/PageIntro';
import { useAutoSweep } from '@/features/auto-sweep/useAutoSweep';
import { AmountDisplay } from '@/components/AmountDisplay';

export function AutoSweepPage() {
  const { plan, loading, approved, setApproved } = useAutoSweep();

  return (
    <PageIntro
      label="AI Modules"
      title='Algorithmic "Auto-Sweep" Capital Router'
      subtitle="Forecasts next-7-day liquidity, sweeps surplus into overnight yield, and auto-pulls back for supplier obligations."
      actions={(
        <div className="app-topbar-date-pill">
          <Sparkles size={14} />
          <span>{approved ? 'Sweep approved' : 'Decision pending'}</span>
        </div>
      )}
    >
      <div className="dashboard-grid">
        <Card accent="navy" className="dashboard-panel" style={{ gridColumn: 'span 8' }}>
          <div className="dashboard-panel-header">
            <div>
              <div className="section-label">Treasury Forecast</div>
              <h2 className="dashboard-panel-title">Liquidity window: next {plan.windowDays} days</h2>
            </div>
          </div>
          <div className="snapshot-grid">
            <div className="snapshot-metric">
              <span className="snapshot-label">Required liquidity</span>
              <strong className="snapshot-value"><AmountDisplay amount={plan.requiredLiquidity} size="lg" /></strong>
              <span className="snapshot-note">Ops buffer</span>
            </div>
            <div className="snapshot-metric">
              <span className="snapshot-label">Projected inflow</span>
              <strong className="snapshot-value"><AmountDisplay amount={plan.projectedInflow} size="lg" /></strong>
              <span className="snapshot-note">Collections forecast</span>
            </div>
            <div className="snapshot-metric">
              <span className="snapshot-label">Projected outflow</span>
              <strong className="snapshot-value"><AmountDisplay amount={plan.projectedOutflow} size="lg" type="debit" /></strong>
              <span className="snapshot-note">Supplier + payout</span>
            </div>
            <div className="snapshot-metric">
              <span className="snapshot-label">Idle cash</span>
              <strong className="snapshot-value"><AmountDisplay amount={plan.idleCash} size="lg" /></strong>
              <span className="snapshot-note">Eligible for sweep</span>
            </div>
          </div>
        </Card>

        <Card accent="success" className="dashboard-panel" style={{ gridColumn: 'span 4' }}>
          <div className="section-label">Recommended Sweep</div>
          <h2 className="dashboard-panel-title" style={{ marginTop: 6 }}><AmountDisplay amount={plan.sweepAmount} size="xl" /></h2>
          <div className="dashboard-row-meta" style={{ marginTop: 8 }}>Expected overnight yield: <strong>Rs. {plan.expectedYield}</strong></div>
          <div className="dashboard-row-meta" style={{ marginTop: 10 }}>{loading ? 'Calibrating treasury model...' : plan.recommendation}</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <Button onClick={() => setApproved(true)} type="button">Approve sweep</Button>
            <Button onClick={() => setApproved(false)} type="button" variant="secondary">Hold</Button>
          </div>
          <div className="dashboard-row-meta" style={{ marginTop: 12, color: approved ? 'var(--success)' : 'var(--text-muted)' }}>
            {approved ? <><CheckCircle2 size={13} /> Sweep queued for execution</> : <><CircleDollarSign size={13} /> Awaiting merchant approval</>}
          </div>
        </Card>
      </div>
    </PageIntro>
  );
}
