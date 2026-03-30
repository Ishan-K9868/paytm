export interface Dispute {
  id: string;
  orderId: string;
  txnId: string;
  txnAmount: number;
  disputeAmount: number;
  disputeType: 'chargeback' | 'refund_not_received' | 'item_not_received' | 'fraud' | 'other';
  status: 'open' | 'draft_ready' | 'submitted' | 'resolved_won' | 'resolved_lost' | 'expired';
  raisedAt: string;
  responseDeadline: string;
  daysRemaining: number;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  merchantResponse?: string;
  aiDraft?: string;
  supportingDocs?: string[];
  resolution?: string;
  customerName?: string;
}
