export interface RouterInsight {
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET' | 'EMI' | 'QR';
  successRate: number;
  failureRate: number;
  avgTransactionValue: number;
  totalTransactions: number;
  failureReasons: Array<{
    code: string;
    message: string;
    count: number;
    percentage: number;
  }>;
  trend: 'improving' | 'stable' | 'declining';
  trendDelta: number;
}

export interface RoutingRecommendation {
  type: 'promote' | 'demote' | 'watch' | 'urgent';
  paymentMethod: string;
  reason: string;
  impact: string;
  confidence: number;
}

export interface AnalyticsPoint {
  date: string;
  amount: number;
  successRate: number;
  method?: string;
  count?: number;
  daysLag?: number;
}

export interface AnalyticsData {
  avgSuccessRate: number;
  disputeRatio: number;
  avgSettlementDays: number;
  anomalyRate: number;
  volume: AnalyticsPoint[];
  successTrend: AnalyticsPoint[];
  methodMix: Array<{ method: string; amount: number }>;
  settlementLag: Array<{ daysLag: number; count: number }>;
  insights: Array<{ title: string; body: string; action: string }>;
}

export interface VoiceResponse {
  answer: string;
  answerHindi?: string;
  dataPoints: Array<{
    label: string;
    value: string;
    type: 'amount' | 'count' | 'status' | 'date';
  }>;
  suggestedActions: Array<{
    label: string;
    route: string;
  }>;
  confidence: 'high' | 'medium' | 'low';
}
