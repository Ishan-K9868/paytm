export type PaymentStatus = 'TXN_SUCCESS' | 'TXN_FAILURE' | 'PENDING' | 'REFUNDED' | 'DISPUTED' | 'PROCESSING';

export interface TransactionVerification {
  orderId: string;
  txnId?: string;
  txnAmount: string;
  status: PaymentStatus;
  bankTxnId?: string;
  paymentMode: string;
  bankName?: string;
  refundAmt?: string;
  txnDate: string;
  gatewayName?: string;
  responseCode: string;
  responseMsg: string;
  aiExplanation?: string;
  aiSuggestedAction?: string;
  settlementEta?: string;
  mdrApplied?: number;
  expectedAmount?: string;
  hasAnomaly?: boolean;
}

export type VerifierState = 'idle' | 'scanning' | 'verified' | 'anomaly' | 'failed' | 'not_found';

export interface PaymentLink {
  id: string;
  linkUrl: string;
  amount: number;
  description: string;
  customerName?: string;
  customerPhone?: string;
  expiryDate?: string;
  status: 'active' | 'paid' | 'expired' | 'cancelled';
  createdAt: string;
  paidAt?: string;
  txnId?: string;
}
