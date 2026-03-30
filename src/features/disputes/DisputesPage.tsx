import { Brain, CheckCircle2, Clock3, Scale } from 'lucide-react';
import { useMemo } from 'react';
import { AmountDisplay } from '@/components/AmountDisplay';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageIntro } from '@/features/shared/PageIntro';
import { DisputeCard } from '@/features/disputes/DisputeCard';
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
              <div className="dispute-group-label">{groupKey}</div>
              {grouped[groupKey].length === 0 ? (
                <div className="dispute-empty-group">No {groupKey} disputes</div>
              ) : (
                grouped[groupKey].map((dispute) => (
                  <DisputeCard dispute={dispute} key={dispute.id} onSelect={() => setSelectedId(dispute.id)} selected={selectedId === dispute.id} />
                ))
              )}
            </div>
          ))}
        </aside>

        <section className="dispute-detail-column">
          {selected ? (
            <>
              <Card accent="error" className="dispute-header">
                <div className="dispute-header-top">
                  <h2 className="dispute-title">{selected.disputeType.replaceAll('_', ' ')}</h2>
                  <div className="countdown-badge"><Clock3 size={14} /> {selected.daysRemaining} day(s) left</div>
                </div>
                <div className="dispute-header-meta">
                  <span className="dispute-order-id">{selected.orderId}</span>
                  <AmountDisplay amount={selected.disputeAmount} size="lg" />
                </div>
                <div className="dispute-header-details">
                  Raised {selected.raisedAt} · deadline {selected.responseDeadline} · customer {selected.customerName}
                </div>
              </Card>

              {transaction ? (
                <Card accent="cyan" className="txn-section">
                  <div className="txn-section-header">Original transaction</div>
                  <div className="txn-fields">
                    <div className="txn-field"><span className="txn-field-label">Amount</span><span className="txn-field-value"><AmountDisplay amount={Number(transaction.txnAmount)} /></span></div>
                    <div className="txn-field"><span className="txn-field-label">Status</span><span className="txn-field-value"><StatusBadge status={transaction.status} /></span></div>
                    <div className="txn-field"><span className="txn-field-label">Payment Mode</span><span className="txn-field-value">{transaction.paymentMode}</span></div>
                    <div className="txn-field"><span className="txn-field-label">Bank Txn ID</span><span className="txn-field-value mono">{transaction.bankTxnId}</span></div>
                  </div>
                </Card>
              ) : null}

              <Card accent="navy" className="ai-draft-section">
                <div className="ai-draft-header">AI Draft</div>
                {!selected.aiDraft && !generatingFor ? (
                  <div className="draft-empty-state">
                    <div className="draft-empty-icon"><Brain size={24} /></div>
                    <div className="draft-empty-title">Generate AI Draft Response</div>
                    <p className="draft-empty-desc">PayAssist writes a first-pass dispute response using the transaction facts.</p>
                    <Button onClick={() => void generateDraft(selected.id)} type="button">Generate Draft</Button>
                  </div>
                ) : null}
                {generatingFor === selected.id ? (
                  <div className="draft-loading-state">
                    <div className="draft-progress-bar" />
                    <div className="draft-loading-text">Reading transaction data... Cross-referencing Paytm records... Drafting response...</div>
                  </div>
                ) : null}
                {selected.aiDraft ? (
                  <div className="draft-content">
                    <div className="ai-generated-pill">AI GENERATED</div>
                    <textarea className="draft-textarea" onChange={(event) => updateDraft(selected.id, event.target.value)} value={selected.aiDraft} />
                    <div className="draft-footer">
                      <span className="draft-hint">Review before submitting - AI drafts may need customization.</span>
                      <span className="draft-word-count">{selected.aiDraft.split(/\s+/).filter(Boolean).length} words</span>
                    </div>
                    <div className="draft-actions">
                      <Button onClick={() => void generateDraft(selected.id)} type="button" variant="secondary">Regenerate</Button>
                      <Button onClick={() => void submitResponse(selected.id)} type="button">Submit Dispute</Button>
                    </div>
                  </div>
                ) : null}
              </Card>

              {submitted ? (
                <div className="submit-confirm">
                  <CheckCircle2 size={48} />
                  <div className="submit-confirm-title">Dispute Submitted Successfully</div>
                  <div className="submit-confirm-ref">Reference: DISP-2026-00{selected.id.slice(-1)}</div>
                </div>
              ) : null}
            </>
          ) : (
            <div className="dispute-idle-state">
              <Scale size={48} color="var(--border-strong)" />
              <div className="dispute-idle-title">Select a dispute to review</div>
              <div className="dispute-idle-desc">Choose a dispute from the left panel to view details and generate an AI response.</div>
            </div>
          )}
        </section>
      </div>
    </PageIntro>
  );
}
