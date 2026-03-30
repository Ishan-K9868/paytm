import { AmountDisplay } from '@/components/AmountDisplay';
import { StatusBadge } from '@/components/StatusBadge';
import type { Dispute } from '@/types/dispute.types';

export function DisputeCard({ dispute, selected, onSelect }: { dispute: Dispute; selected: boolean; onSelect: () => void }) {
  return (
    <button className={`dispute-card ${selected ? 'selected' : ''}`} onClick={onSelect} type="button">
      <div className="dispute-card-row"><span className="dashboard-row-title">{dispute.disputeType.replaceAll('_', ' ')}</span><span className={`urgency-pill ${dispute.urgency}`}>{dispute.daysRemaining} day</span></div>
      <div className="dispute-card-row"><span className="mono">{dispute.orderId}</span><AmountDisplay amount={dispute.disputeAmount} /></div>
      <div className="dispute-card-row"><StatusBadge status={dispute.status.startsWith('resolved') ? 'REFUNDED' : 'DISPUTED'} /><span className="dashboard-row-meta">{dispute.aiDraft ? 'AI draft ready' : 'Needs draft'}</span></div>
    </button>
  );
}
