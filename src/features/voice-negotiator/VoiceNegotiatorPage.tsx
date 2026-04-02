import { CheckCircle2, Clock3, Mic, Send } from 'lucide-react';
import { AmountDisplay } from '@/components/AmountDisplay';
import { Button, Card, Input } from '@/components/ui';
import { PageIntro } from '@/features/shared/PageIntro';
import { useVoiceNegotiator } from '@/features/voice-negotiator/useVoiceNegotiator';

export function VoiceNegotiatorPage() {
  const {
    request,
    setRequest,
    quantity,
    setQuantity,
    result,
    loading,
    approved,
    phase,
    dealExecution,
    activityLog,
    approveDeal,
    holdDeal,
    runNegotiation,
  } = useVoiceNegotiator();

  return (
    <PageIntro
      label="AI Modules"
      title="Autonomous Voice-Negotiator"
      subtitle="Agentic supply chain assistant that negotiates with multiple distributors and returns the best bulk deal for one-tap approval."
      actions={(
        <div className="app-topbar-date-pill">
          <Mic size={14} />
          <span>{approved ? 'Deal approved' : phase === 'on_hold' ? 'Deal on hold' : 'Awaiting approval'}</span>
        </div>
      )}
    >
      <div className="dashboard-grid">
        <Card accent="cyan" className="dashboard-panel" style={{ gridColumn: 'span 12' }}>
          <div className="dashboard-panel-header">
            <div>
              <div className="section-label">Negotiation Request</div>
              <h2 className="dashboard-panel-title">Supplier haggling control panel</h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 120px auto', gap: 10 }}>
            <Input className="input" value={request} onChange={(event) => setRequest(event.target.value)} />
            <Input className="input" type="number" value={quantity} min={1} onChange={(event) => setQuantity(Number(event.target.value) || 1)} />
            <Button onClick={() => void runNegotiation()} type="button">{loading ? 'Negotiating...' : 'Run negotiation'}</Button>
          </div>
          <div className="dashboard-row-meta" style={{ marginTop: 10 }}>
            Current phase: <strong>{phase.replace('_', ' ')}</strong>
          </div>
        </Card>

        <Card accent="navy" className="dashboard-panel" style={{ gridColumn: 'span 8' }}>
          <div className="dashboard-panel-header">
            <div>
              <div className="section-label">Distributor Quotes</div>
              <h2 className="dashboard-panel-title">{result.request}</h2>
            </div>
          </div>
          <div className="dashboard-list">
            {result.quotes.map((quote) => (
              <div className="dashboard-list-row" key={quote.supplier}>
                <div>
                  <div className="dashboard-row-title">{quote.supplier}</div>
                  <div className="dashboard-row-meta">
                    Opening Rs. {quote.openingQuotePerUnit} to Negotiated Rs. {quote.negotiatedQuotePerUnit} · Delivery {quote.deliveryHours}h
                  </div>
                </div>
                <div className={`status-pill ${phase === 'contacting' || phase === 'negotiating' ? 'pending' : 'approved'}`}>
                  {phase === 'contacting' || phase === 'negotiating' ? 'Negotiating' : quote.status}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14, padding: '12px 14px', borderRadius: '12px', background: 'var(--bg-hover)' }}>
            <div className="section-label">Live activity</div>
            <div style={{ display: 'grid', gap: 6, marginTop: 6 }}>
              {activityLog.map((entry) => (
                <div key={entry} className="dashboard-row-meta">• {entry}</div>
              ))}
            </div>
          </div>
        </Card>

        <Card accent="success" className="dashboard-panel" style={{ gridColumn: 'span 4' }}>
          <div className="section-label">Best Secured Deal</div>
          <h2 className="dashboard-panel-title">{result.bestSupplier}</h2>
          <div className="dashboard-row-meta" style={{ marginTop: 8 }}>Total savings vs worst quote</div>
          <div className="dashboard-row-amount"><AmountDisplay amount={result.totalSavings} size="lg" /></div>
          <div className="dashboard-row-meta" style={{ marginTop: 10 }}>{result.recommendation}</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <Button disabled={phase !== 'ready' && phase !== 'on_hold'} onClick={approveDeal} type="button">Approve & Pay</Button>
            <Button onClick={holdDeal} type="button" variant="secondary">Hold</Button>
          </div>
          <div className="dashboard-row-meta" style={{ marginTop: 10, color: approved ? 'var(--success)' : 'var(--text-muted)' }}>
            {approved ? <><CheckCircle2 size={13} /> Supplier order committed</> : phase === 'on_hold' ? <><Clock3 size={13} /> Deal on hold for manual review</> : <><Send size={13} /> Waiting for your approval</>}
          </div>
          {dealExecution ? (
            <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: '10px', background: 'var(--bg-hover)' }}>
              <div className="dashboard-row-meta">Payment Ref: <strong>{dealExecution.paymentReference}</strong></div>
              <div className="dashboard-row-meta">Approved: {dealExecution.approvedAt}</div>
              <div className="dashboard-row-meta">Expected delivery: {dealExecution.expectedDelivery}</div>
            </div>
          ) : null}
        </Card>
      </div>
    </PageIntro>
  );
}
