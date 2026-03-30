export interface ReconciliationRecord {
  date: string;
  orderId: string;
  txnId: string;
  paymentMode: string;
  txnAmount: number;
  mdrAmount: number;
  netSettlement: number;
  settledAmount?: number;
  settlementDate?: string;
  status: 'matched' | 'pending' | 'anomaly' | 'refunded';
  anomalyType?: 'amount_mismatch' | 'missing_settlement' | 'mdr_discrepancy' | 'duplicate';
  anomalyDelta?: number;
}

export interface ReconciliationAnomaly {
  id: string;
  type: 'missing_credit' | 'mdr_discrepancy' | 'refund_pending' | 'duplicate_debit' | 'amount_mismatch';
  severity: 'high' | 'medium' | 'low';
  orderId: string;
  expectedAmount: number;
  actualAmount: number;
  delta: number;
  description: string;
  suggestedAction: string;
  aiExplanation?: string;
}

export interface DayReconciliationSummary {
  date: string;
  totalCollected: number;
  totalSettled: number;
  delta: number;
  transactionCount: number;
  anomalyCount: number;
  anomalies: ReconciliationAnomaly[];
  records: ReconciliationRecord[];
  status: 'balanced' | 'anomalies_found' | 'pending_settlement';
}
