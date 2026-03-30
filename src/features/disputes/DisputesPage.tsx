import { Brain, CheckCircle2, Clock3, Scale } from 'lucide-react';
import { useMemo } from 'react';
import { AmountDisplay } from '@/components/AmountDisplay';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageIntro } from '@/features/shared/PageIntro';
import { useDisputes } from '@/features/disputes/useDisputes';
import { demoTransactions } from '@/data/demoAppData';

export function DisputesPage() {
  const { disputes, selected, selectedId, setSelectedId, generatingFor, generateDraft, updateDraft, submitResponse, submittedIds } = useDisputes();
  const grouped = useMemo(() => ({
    critical: disputes.filter((item) => item.urgency === 'critical'),
    high: disputes.filter((item) => item.urgency === 'high'),
    resolved: disputes.filter((item) => item.status.startsWith('resolved')),
  }), [disputes]);

  const transaction = selected ? demoTransactions[selected.orderId] ?? Object.values(demoTransactions)[0] : null;
  const submitted = selected ? submittedIds.includes(selected.id) : false;

  return (
    <PageIntro
      label="Operations"
      subtitle="Sort disputes by urgency, generate an AI draft, and submit with the original transaction facts in view."
      title="Disputes"
    >
      <div className="dispute-layout">
        <aside className="dispute-list-column">
          {(['critical', 'high', 'resolved'] as const).map((groupKey) => (
            <div className="dispute-group" key={groupKey}>
              <div className="app-nav-section">{groupKey}</div>
              {grouped[groupKey].map((dispute) => (
                <button className={`dispute-card ${selectedId === dispute.id ? 'selected' : ''}`} key={dispute.id} onClick={() => setSelectedId(dispute.id)} type="button">
                  <div className="dispute-card-row"><span className="dashboard-row-title">{dispute.disputeType.replaceAll('_', ' ')}</span><span className={`urgency-pill ${dispute.urgency}`}>{dispute.daysRemaining} day</span></div>
                  <div className="dispute-card-row"><span className="mono">{dispute.orderId}</span><AmountDisplay amount={dispute.disputeAmount} /></div>
                  <div className="dispute-card-row"><StatusBadge status={dispute.status.startsWith('resolved') ? 'REFUNDED' : 'DISPUTED'} /><span className="dashboard-row-meta">{dispute.aiDraft ? 'AI draft ready' : 'Needs draft'}</span></div>
                </button>
              ))}
            </div>
          ))}
        </aside>

        <section className="dispute-detail-column">
          {selected ? (
            <>
              <Card accent="error" className="dispute-header">
                <div className="dispute-card-row"><h2 className="dashboard-panel-title">{selected.disputeType.replaceAll('_', ' ')}</h2><div className="countdown-display"><Clock3 size={14} /> {selected.daysRemaining} day(s) left</div></div>
                <div className="dispute-card-row"><span className="mono">{selected.orderId}</span><AmountDisplay amount={selected.disputeAmount} /></div>
                <div className="dashboard-row-meta">Raised {selected.raisedAt} · deadline {selected.responseDeadline} · customer {selected.customerName}</div>
              </Card>

              {transaction ? (
                <Card accent="cyan" className="txn-section">
                  <div className="section-label">Original transaction</div>
                  <div className="result-field"><span className="field-label">Amount</span><span className="field-value amount"><AmountDisplay amount={Number(transaction.txnAmount)} /></span></div>
                  <div className="result-field"><span className="field-label">Status</span><span className="field-value"><StatusBadge status={transaction.status} /></span></div>
                  <div className="result-field"><span className="field-label">Payment Mode</span><span className="field-value">{transaction.paymentMode}</span></div>
                  <div className="result-field"><span className="field-label">Bank Txn ID</span><span className="field-value mono">{transaction.bankTxnId}</span></div>
                </Card>
              ) : null}

              <Card accent="navy" className="ai-draft-section">
                <div className="section-label">AI Draft</div>
                {!selected.aiDraft && !generatingFor ? (
                  <div className="draft-empty-state">
                    <div className="draft-empty-icon"><Brain size={20} /></div>
                    <div className="dashboard-panel-title">Generate AI Draft Response</div>
                    <p className="page-subtitle">PayAssist writes a first-pass dispute response using the transaction facts.</p>
                    <Button onClick={() => void generateDraft(selected.id)} type="button">Generate Draft</Button>
                  </div>
                ) : null}
                {generatingFor === selected.id ? (
                  <div className="draft-loading-state">
                    <div className="draft-progress-bar" />
                    <div className="page-subtitle">Reading transaction data... Cross-referencing Paytm records... Drafting response...</div>
                  </div>
                ) : null}
                {selected.aiDraft ? (
                  <>
                    <div className="ai-generated-pill">AI GENERATED</div>
                    <textarea className="draft-textarea" onChange={(event) => updateDraft(selected.id, event.target.value)} value={selected.aiDraft} />
                    <div className="draft-footer-row">
                      <span className="dashboard-row-meta">Review before submitting - AI drafts may need customization.</span>
                      <span className="dashboard-row-meta">{selected.aiDraft.split(/\s+/).filter(Boolean).length} words</span>
                    </div>
                    <div className="auth-actions-row">
                      <Button onClick={() => void generateDraft(selected.id)} type="button" variant="secondary">Regenerate</Button>
                      <Button onClick={() => void submitResponse(selected.id)} type="button">Submit Dispute</Button>
                    </div>
                  </>
                ) : null}
              </Card>

              {submitted ? (
                <div className="submit-confirm">
                  <CheckCircle2 size={48} />
                  <div className="dashboard-panel-title">Dispute Submitted Successfully</div>
                  <div className="dashboard-row-meta">Reference: DISP-2026-00{selected.id.slice(-1)}</div>
                </div>
              ) : null}
            </>
          ) : (
            <div className="result-idle"><Scale size={48} color="var(--border-strong)" /><div className="dashboard-panel-title">Select a dispute to review</div></div>
          )}
        </section>
      </div>
    </PageIntro>
  );
}
