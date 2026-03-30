import type { Dispute } from '@/types/dispute.types';
import type { AnalyticsData, RouterInsight, RoutingRecommendation, VoiceResponse } from '@/types/insights.types';
import type { AppNotification } from '@/types/merchant.types';
import type { PaymentLink, TransactionVerification } from '@/types/payment.types';
import type { DayReconciliationSummary, ReconciliationAnomaly, ReconciliationRecord } from '@/types/reconciliation.types';

export const demoTransactions: Record<string, TransactionVerification> = {
  'PAY2024032991234': {
    orderId: 'PAY2024032991234',
    txnId: 'TXN89324510',
    txnAmount: '540.00',
    status: 'TXN_SUCCESS',
    bankTxnId: 'SBI90231499',
    paymentMode: 'UPI',
    bankName: 'State Bank of India',
    txnDate: '29 Mar 2026, 09:14 PM',
    gatewayName: 'Paytm PG',
    responseCode: '01',
    responseMsg: 'Transaction successful',
    aiExplanation: 'Payment is verified on Paytm rails. The customer paid Rs. 540 through UPI and the bank reference is already issued, so you can confidently treat this order as collected.',
    aiSuggestedAction: 'Mark order as paid and continue fulfilment.',
    settlementEta: 'Expected in next T+1 cycle',
    mdrApplied: 0,
  },
  'ORD-KR-20240329-0044': {
    orderId: 'ORD-KR-20240329-0044',
    txnId: 'TXN88324544',
    txnAmount: '1200.00',
    status: 'TXN_FAILURE',
    bankTxnId: 'HDFC008921',
    paymentMode: 'CARD',
    bankName: 'HDFC Bank',
    txnDate: '29 Mar 2026, 08:42 PM',
    gatewayName: 'Paytm PG',
    responseCode: '227',
    responseMsg: 'Insufficient balance',
    aiExplanation: 'This attempt failed at the bank step because the issuing account did not have enough funds. No money reached your Paytm ledger, so you should ask the customer to retry or send a payment link.',
    aiSuggestedAction: 'Resend checkout or share a payment link.',
    settlementEta: 'No settlement because payment failed',
    mdrApplied: 0,
  },
  'UPI240329123456': {
    orderId: 'UPI240329123456',
    txnId: 'TXN89324589',
    txnAmount: '1200.00',
    status: 'PROCESSING',
    paymentMode: 'UPI',
    txnDate: '29 Mar 2026, 09:21 PM',
    gatewayName: 'Paytm PG',
    responseCode: '501',
    responseMsg: 'Awaiting confirmation from bank',
    aiExplanation: 'The payment is still in flight between the UPI app and the bank. Ask the customer not to pay again yet; this usually resolves shortly or flips to failed if the bank does not confirm.',
    aiSuggestedAction: 'Wait a few minutes, then re-check status.',
    settlementEta: 'Pending bank confirmation',
    mdrApplied: 0,
  },
};

export const demoRecords: ReconciliationRecord[] = [
  { date: '2026-03-30', orderId: 'PAY2024032991234', txnId: 'TXN89324510', paymentMode: 'UPI', txnAmount: 540, mdrAmount: 0, netSettlement: 540, settledAmount: 540, settlementDate: '2026-03-31', status: 'matched' },
  { date: '2026-03-30', orderId: 'ORD-KR-20240329-0044', txnId: 'TXN88324544', paymentMode: 'CARD', txnAmount: 1200, mdrAmount: 28.32, netSettlement: 1171.68, settledAmount: 0, settlementDate: '', status: 'pending' },
  { date: '2026-03-30', orderId: 'ORD-240330-117', txnId: 'TXN90011744', paymentMode: 'UPI', txnAmount: 8400, mdrAmount: 0, netSettlement: 8400, settledAmount: 7560, settlementDate: '2026-03-31', status: 'anomaly', anomalyType: 'amount_mismatch', anomalyDelta: 840 },
  { date: '2026-03-30', orderId: 'ORD-240330-108', txnId: 'TXN90010811', paymentMode: 'WALLET', txnAmount: 390, mdrAmount: 6.5, netSettlement: 383.5, settledAmount: 383.5, settlementDate: '2026-03-31', status: 'matched' },
  { date: '2026-03-30', orderId: 'ORD-240330-104', txnId: 'TXN90010476', paymentMode: 'CARD', txnAmount: 2240, mdrAmount: 39.8, netSettlement: 2200.2, settledAmount: 0, settlementDate: '', status: 'anomaly', anomalyType: 'missing_settlement', anomalyDelta: 2200.2 },
  { date: '2026-03-30', orderId: 'ORD-240330-099', txnId: 'TXN90009912', paymentMode: 'QR', txnAmount: 990, mdrAmount: 0, netSettlement: 990, settledAmount: 990, settlementDate: '2026-03-31', status: 'refunded' },
];

export const demoAnomalies: ReconciliationAnomaly[] = [
  {
    id: 'anom-1',
    type: 'amount_mismatch',
    severity: 'high',
    orderId: 'ORD-240330-117',
    expectedAmount: 8400,
    actualAmount: 7560,
    delta: 840,
    description: 'Settlement landed short against collected amount.',
    suggestedAction: 'Pull settlement detail and raise a Paytm query if batch remains short.',
    aiExplanation: 'This looks like a partial credit in the settlement batch. The difference is too large to be explained by MDR, so keep the order in review and trace the settlement report before closing the day.',
  },
  {
    id: 'anom-2',
    type: 'missing_credit',
    severity: 'medium',
    orderId: 'ORD-240330-104',
    expectedAmount: 2200.2,
    actualAmount: 0,
    delta: 2200.2,
    description: 'Successful transaction still missing from settlement file.',
    suggestedAction: 'Wait one cycle, then escalate if still absent.',
    aiExplanation: 'The payment was successful, but the settlement file has not acknowledged it yet. This often resolves in the next batch, but it should stay on the anomaly watchlist until that happens.',
  },
];

export const demoReconciliationSummary: DayReconciliationSummary = {
  date: '2026-03-30',
  totalCollected: 13760,
  totalSettled: 11473.5,
  delta: 2286.5,
  transactionCount: demoRecords.length,
  anomalyCount: demoAnomalies.length,
  anomalies: demoAnomalies,
  records: demoRecords,
  status: 'anomalies_found',
};

export const demoDisputes: Dispute[] = [
  {
    id: 'disp-1',
    orderId: 'ORD-240330-104',
    txnId: 'TXN90010476',
    txnAmount: 2240,
    disputeAmount: 2240,
    disputeType: 'refund_not_received',
    status: 'draft_ready',
    raisedAt: '29 Mar 2026',
    responseDeadline: '31 Mar 2026',
    daysRemaining: 1,
    urgency: 'critical',
    customerName: 'Rohan Malhotra',
    aiDraft: 'Dear Paytm Dispute Team, the transaction tied to Order ID ORD-240330-104 was successfully processed on our end and the bank reference confirms completion. Our records show the order was delivered and there is no refund instruction against this transaction. We request that the dispute be resolved in the merchant\'s favour in line with the gateway and bank evidence attached.',
  },
  {
    id: 'disp-2',
    orderId: 'PAY2024032991234',
    txnId: 'TXN89324510',
    txnAmount: 540,
    disputeAmount: 540,
    disputeType: 'chargeback',
    status: 'open',
    raisedAt: '28 Mar 2026',
    responseDeadline: '02 Apr 2026',
    daysRemaining: 3,
    urgency: 'high',
    customerName: 'Neha Arora',
  },
  {
    id: 'disp-3',
    orderId: 'ORD-240330-088',
    txnId: 'TXN90008813',
    txnAmount: 1320,
    disputeAmount: 1320,
    disputeType: 'item_not_received',
    status: 'resolved_won',
    raisedAt: '18 Mar 2026',
    responseDeadline: '22 Mar 2026',
    daysRemaining: 0,
    urgency: 'low',
    customerName: 'Sunita Vyas',
    resolution: 'Resolved in merchant favour',
  },
];

export const demoRouterInsights: RouterInsight[] = [
  { paymentMethod: 'UPI', successRate: 97.4, failureRate: 2.6, avgTransactionValue: 620, totalTransactions: 1240, failureReasons: [{ code: 'U16', message: 'Customer app timeout', count: 22, percentage: 1.8 }], trend: 'improving', trendDelta: 1.4 },
  { paymentMethod: 'CARD', successRate: 82.1, failureRate: 17.9, avgTransactionValue: 1480, totalTransactions: 420, failureReasons: [{ code: '227', message: 'Insufficient balance', count: 32, percentage: 7.6 }], trend: 'declining', trendDelta: -4.2 },
  { paymentMethod: 'WALLET', successRate: 91.2, failureRate: 8.8, avgTransactionValue: 410, totalTransactions: 280, failureReasons: [{ code: 'W11', message: 'Wallet unavailable', count: 14, percentage: 5 }], trend: 'stable', trendDelta: 0.3 },
  { paymentMethod: 'QR', successRate: 96.1, failureRate: 3.9, avgTransactionValue: 320, totalTransactions: 660, failureReasons: [{ code: 'Q09', message: 'Customer abandoned', count: 18, percentage: 2.7 }], trend: 'improving', trendDelta: 0.8 },
];

export const demoRecommendations: RoutingRecommendation[] = [
  {
    type: 'urgent',
    paymentMethod: 'CARD',
    reason: 'Card success rate is under the 85% comfort band during evening traffic.',
    impact: 'Demoting card behind UPI after 7 PM could recover roughly 6-8% of failed checkouts.',
    confidence: 88,
  },
  {
    type: 'promote',
    paymentMethod: 'UPI',
    reason: 'UPI is delivering the strongest success rate with steady value per order.',
    impact: 'Promoting UPI as the default option should lift overall conversion without hurting ticket size.',
    confidence: 81,
  },
  {
    type: 'watch',
    paymentMethod: 'WALLET',
    reason: 'Wallet is stable now, but failures cluster around campaign spikes.',
    impact: 'Keep it visible, but watch campaign windows and top-up completion behavior.',
    confidence: 63,
  },
];

export const demoAnalytics: AnalyticsData = {
  avgSuccessRate: 94,
  disputeRatio: 0.018,
  avgSettlementDays: 1.8,
  anomalyRate: 0.032,
  volume: [
    { date: 'Mar 24', amount: 42000, successRate: 93 },
    { date: 'Mar 25', amount: 38800, successRate: 92 },
    { date: 'Mar 26', amount: 51700, successRate: 95 },
    { date: 'Mar 27', amount: 48200, successRate: 96 },
    { date: 'Mar 28', amount: 56400, successRate: 95 },
    { date: 'Mar 29', amount: 60300, successRate: 94 },
    { date: 'Mar 30', amount: 62150, successRate: 96 },
  ],
  successTrend: [
    { date: 'Mar 24', amount: 0, successRate: 93 },
    { date: 'Mar 25', amount: 0, successRate: 92 },
    { date: 'Mar 26', amount: 0, successRate: 95 },
    { date: 'Mar 27', amount: 0, successRate: 96 },
    { date: 'Mar 28', amount: 0, successRate: 95 },
    { date: 'Mar 29', amount: 0, successRate: 94 },
    { date: 'Mar 30', amount: 0, successRate: 96 },
  ],
  methodMix: [
    { method: 'UPI', amount: 62 },
    { method: 'CARD', amount: 18 },
    { method: 'QR', amount: 12 },
    { method: 'WALLET', amount: 8 },
  ],
  settlementLag: [
    { daysLag: 0, count: 28 },
    { daysLag: 1, count: 64 },
    { daysLag: 2, count: 18 },
    { daysLag: 3, count: 5 },
  ],
  insights: [
    { title: 'UPI carries the day', body: 'UPI is generating the highest share of clean collections with almost no MDR drag.', action: 'Promote UPI as primary checkout path' },
    { title: 'Card friction spikes at night', body: 'Card failures cluster after 7 PM, especially on higher-value orders.', action: 'Review routing priority for evening traffic' },
    { title: 'Settlement lag is healthy', body: 'Most successful payments are reaching settlement within one cycle, which keeps books easier to close.', action: 'Keep anomaly review focused on card-led batches' },
  ],
};

export const demoNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'anomaly_detected',
    title: 'Settlement mismatch flagged',
    message: 'Rs. 840 delta detected in yesterday\'s final settlement batch.',
    read: false,
    urgency: 'high',
    timestamp: '10m ago',
    actionUrl: '/app/reconciliation',
  },
  {
    id: 'notif-2',
    type: 'dispute_deadline',
    title: 'Dispute response due tomorrow',
    message: 'Chargeback on ORD-KR-240329 needs a response before 5 PM.',
    read: false,
    urgency: 'critical',
    timestamp: '27m ago',
    actionUrl: '/app/disputes',
  },
  {
    id: 'notif-3',
    type: 'settlement_complete',
    title: 'Settlement complete',
    message: 'Rs. 42,180 has been settled into your linked account.',
    read: true,
    urgency: 'low',
    timestamp: '2h ago',
    actionUrl: '/app/reconciliation',
  },
];

export const demoPaymentLinks: PaymentLink[] = [
  {
    id: 'link-1',
    linkUrl: 'https://payassist.app/pay/lnk_001',
    amount: 1250,
    description: 'Advance for mixer repair',
    customerName: 'Sandeep',
    customerPhone: '9876543210',
    expiryDate: '02 Apr 2026',
    status: 'active',
    createdAt: '30 Mar 2026, 11:45 AM',
  },
  {
    id: 'link-2',
    linkUrl: 'https://payassist.app/pay/lnk_002',
    amount: 540,
    description: 'Home delivery order',
    customerName: 'Neha',
    status: 'paid',
    createdAt: '29 Mar 2026, 04:20 PM',
    paidAt: '29 Mar 2026, 04:27 PM',
    txnId: 'TXN89324510',
  },
  {
    id: 'link-3',
    linkUrl: 'https://payassist.app/pay/lnk_003',
    amount: 2100,
    description: 'Bulk office snacks order',
    customerName: 'Dev Corp',
    status: 'expired',
    createdAt: '22 Mar 2026, 09:05 AM',
    expiryDate: '25 Mar 2026',
  },
];

export const voiceQueries: Record<string, VoiceResponse> = {
  'aaj kitna collected hua': {
    answer: 'Today you collected Rs. 62,150 across 184 successful transactions. UPI is driving most of the volume and the day is tracking above your 7-day average.',
    dataPoints: [
      { label: 'Collected today', value: 'Rs. 62,150', type: 'amount' },
      { label: 'Transactions', value: '184', type: 'count' },
      { label: 'Success rate', value: '96%', type: 'status' },
    ],
    suggestedActions: [
      { label: 'Open analytics', route: '/app/analytics' },
      { label: 'Review reconciliation', route: '/app/reconciliation' },
    ],
    confidence: 'high',
  },
  'kya rs 450 wala payment aaya': {
    answer: 'I can see a nearby verified payment for Rs. 540, but not a confirmed Rs. 450 one in the latest demo ledger. Open the verifier and search by order ID to confirm the exact customer claim.',
    dataPoints: [
      { label: 'Closest match', value: 'Rs. 540', type: 'amount' },
      { label: 'Status', value: 'Verified', type: 'status' },
    ],
    suggestedActions: [{ label: 'Open verifier', route: '/app/verify' }],
    confidence: 'medium',
  },
  'mera dispute kab resolve hoga': {
    answer: 'You currently have one critical dispute that needs a response within 1 day and one high-priority dispute with 3 days remaining. Once submitted, Paytm typically responds within the RBI timeline attached to the case type.',
    dataPoints: [
      { label: 'Critical disputes', value: '1', type: 'count' },
      { label: 'High priority', value: '1', type: 'count' },
    ],
    suggestedActions: [{ label: 'Open disputes', route: '/app/disputes' }],
    confidence: 'high',
  },
};
