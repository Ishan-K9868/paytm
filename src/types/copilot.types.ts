export type CopilotActionSeverity = 'critical' | 'high' | 'medium' | 'low';
export type CopilotActionStatus = 'pending' | 'approved' | 'blocked' | 'scheduled' | 'live';

export interface CopilotActionFeedItem {
  id: string;
  module:
    | 'fraud_shield'
    | 'recon_dispute'
    | 'ondc_procurement'
    | 'credit_catalyst'
    | 'yield_crm';
  title: string;
  summary: string;
  metricLabel: string;
  metricValue: string;
  severity: CopilotActionSeverity;
  recommendation: string;
  primaryAction: string;
  secondaryAction?: string;
  route: string;
  status: CopilotActionStatus;
}

export interface ActionFeedResponse {
  generatedAt: string;
  actions: CopilotActionFeedItem[];
  narrative: string;
}

export interface AutoSweepPlan {
  windowDays: number;
  requiredLiquidity: number;
  projectedInflow: number;
  projectedOutflow: number;
  idleCash: number;
  sweepAmount: number;
  expectedYield: number;
  recommendation: string;
  confidence: number;
}

export interface VyaparSetuPartner {
  merchantName: string;
  category: string;
  distanceKm: number;
  matchScore: number;
  coupon: string;
  projectedCrossSales: number;
}

export interface VyaparSetuNetwork {
  clusterName: string;
  activeCustomersToday: number;
  partners: VyaparSetuPartner[];
  recommendation: string;
}

export interface SupplierQuote {
  supplier: string;
  openingQuotePerUnit: number;
  negotiatedQuotePerUnit: number;
  deliveryHours: number;
  status: 'negotiating' | 'finalized';
}

export interface VoiceNegotiationResult {
  request: string;
  quantity: number;
  quotes: SupplierQuote[];
  bestSupplier: string;
  totalSavings: number;
  recommendation: string;
}

export interface GenAIAdCampaign {
  productName: string;
  headline: string;
  headlineHindi: string;
  body: string;
  bodyHindi: string;
  offerText: string;
  whatsappMessage: string;
  targetRadiusKm: number;
  projectedReach: number;
  projectedRevenue: number;
  recommendation: string;
}
