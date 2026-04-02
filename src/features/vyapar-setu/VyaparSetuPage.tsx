import { ArrowUpRight, CheckCircle2, GitMerge, Store } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { PageIntro } from '@/features/shared/PageIntro';
import { useVyaparSetu } from '@/features/vyapar-setu/useVyaparSetu';
import { AmountDisplay } from '@/components/AmountDisplay';

export function VyaparSetuPage() {
  const { network, loading, approvedCoupons, approveCoupon } = useVyaparSetu();

  return (
    <PageIntro
      label="AI Modules"
      title="Paytm Vyapar-Setu"
      subtitle="Hyperlocal collaborative commerce graph that drives cross-sell coupons between complementary nearby merchants."
      actions={(
        <div className="app-topbar-date-pill">
          <GitMerge size={14} />
          <span>{approvedCoupons.length} coupons approved</span>
        </div>
      )}
    >
      <div className="dashboard-grid">
        <Card accent="cyan" className="dashboard-panel" style={{ gridColumn: 'span 12' }}>
          <div className="dashboard-panel-header">
            <div>
              <div className="section-label">Active Cluster</div>
              <h2 className="dashboard-panel-title">{network.clusterName}</h2>
            </div>
            <div className="app-topbar-date-pill">
              <Store size={14} />
              <span>{network.activeCustomersToday} customers today</span>
            </div>
          </div>
          <p className="page-subtitle">{loading ? 'Refreshing graph matches...' : network.recommendation}</p>
        </Card>

        {network.partners.map((partner) => {
          const approved = approvedCoupons.includes(partner.coupon);
          return (
            <Card key={partner.coupon} accent="navy" className="dashboard-panel" style={{ gridColumn: 'span 4' }}>
              <div className="dashboard-panel-header">
                <div>
                  <div className="section-label">{partner.category}</div>
                  <h2 className="dashboard-panel-title">{partner.merchantName}</h2>
                </div>
                <span className={`status-pill ${approved ? 'approved' : 'pending'}`}>
                  {approved ? <CheckCircle2 size={12} /> : null}
                  {approved ? 'approved' : 'pending'}
                </span>
              </div>
              <div className="dashboard-row-meta">{partner.distanceKm} km away · Match {partner.matchScore}%</div>
              <div style={{ marginTop: 10 }} className="dashboard-row-meta">Projected cross-sell lift</div>
              <div className="dashboard-row-amount"><AmountDisplay amount={partner.projectedCrossSales} size="lg" /></div>
              <div
                style={{
                  marginTop: 10,
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: 'var(--bg-hover)',
                  fontSize: '12px',
                  color: 'var(--text-body)',
                }}
              >
                Coupon code: <strong>{partner.coupon}</strong>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                <Button onClick={() => approveCoupon(partner.coupon)} type="button">
                  Approve coupon
                </Button>
                <Button type="button" variant="secondary">Skip</Button>
              </div>
              <div style={{ marginTop: 10 }}>
                <span className="dashboard-inline-link">
                  Push to partner node <ArrowUpRight size={14} />
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </PageIntro>
  );
}
