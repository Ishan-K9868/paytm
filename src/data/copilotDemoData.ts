import type {
  ActionFeedResponse,
  AutoSweepPlan,
  GenAIAdCampaign,
  VoiceNegotiationResult,
  VyaparSetuNetwork,
} from '@/types/copilot.types';

export const demoActionFeed: ActionFeedResponse = {
  generatedAt: '02 Apr 2026, 07:30 PM',
  narrative:
    'Swarm AI has identified one high-risk anomaly, two liquidity opportunities, and two growth actions that can be approved in a single tap.',
  actions: [
    {
      id: 'action-1',
      module: 'fraud_shield',
      title: 'Zero-Trust anomaly intercepted',
      summary:
        'A Rs. 22,000 payment came from a new device and unusual timing versus your normal Rs. 1,200 average ticket profile.',
      metricLabel: 'Risk score',
      metricValue: '94/100',
      severity: 'critical',
      recommendation: 'Hold settlement and ask merchant to Confirm or Block immediately.',
      primaryAction: 'Confirm payment',
      secondaryAction: 'Block payment',
      route: '/app/verify',
      status: 'pending',
    },
    {
      id: 'action-2',
      module: 'recon_dispute',
      title: 'RBI dispute draft ready',
      summary:
        'Two missing refund cases are reconciled, and one chargeback response has been auto-drafted with transaction evidence.',
      metricLabel: 'Deadline',
      metricValue: '11h 42m left',
      severity: 'high',
      recommendation: 'Review and submit the draft now to avoid expiry.',
      primaryAction: 'Open dispute draft',
      secondaryAction: 'Review reconciliation',
      route: '/app/disputes',
      status: 'pending',
    },
    {
      id: 'action-3',
      module: 'ondc_procurement',
      title: 'Stockout predicted before weekend',
      summary:
        'Festival-adjusted demand model predicts low stock for top biscuit SKU in 2.4 days. ONDC found a higher margin supplier.',
      metricLabel: 'Projected stockout',
      metricValue: '2.4 days',
      severity: 'high',
      recommendation: 'Approve the pre-filled purchase order to prevent shelf-out.',
      primaryAction: 'Approve PO',
      secondaryAction: 'Review suppliers',
      route: '/app/voice-negotiator',
      status: 'pending',
    },
    {
      id: 'action-4',
      module: 'credit_catalyst',
      title: 'Bridge credit pre-approved',
      summary:
        'Continuous underwriting sees strong repayment signal and low fraud exposure. A short bridge line is available instantly.',
      metricLabel: 'Offer',
      metricValue: 'Rs. 50,000',
      severity: 'medium',
      recommendation: 'Claim only if inventory cash cycle is tight this week.',
      primaryAction: 'Claim offer',
      secondaryAction: 'View score drivers',
      route: '/app/analytics',
      status: 'pending',
    },
    {
      id: 'action-5',
      module: 'yield_crm',
      title: 'Slow inventory campaign prepared',
      summary:
        'Near-expiry snacks are tagged. WhatsApp promo campaign with 10% offer is drafted for your repeat customers.',
      metricLabel: 'Projected uplift',
      metricValue: '+Rs. 8,700',
      severity: 'medium',
      recommendation: 'Approve campaign distribution in one tap.',
      primaryAction: 'Approve campaign',
      secondaryAction: 'Edit audience',
      route: '/app/genai-ad-engine',
      status: 'scheduled',
    },
  ],
};

export const demoAutoSweepPlan: AutoSweepPlan = {
  windowDays: 7,
  requiredLiquidity: 68000,
  projectedInflow: 126000,
  projectedOutflow: 54000,
  idleCash: 72000,
  sweepAmount: 42000,
  expectedYield: 368,
  recommendation:
    'Sweep Rs. 42,000 into overnight fund and keep Rs. 30,000 as operational buffer for supplier payments.',
  confidence: 87,
};

export const demoVyaparSetuNetwork: VyaparSetuNetwork = {
  clusterName: 'Noida Sector 62 Daily Essentials Cluster',
  activeCustomersToday: 312,
  recommendation:
    'Launch cross-sell coupons with bakery and dairy partners during evening peak to retain local spend in-cluster.',
  partners: [
    {
      merchantName: 'Gupta Fresh Dairy',
      category: 'Dairy',
      distanceKm: 0.7,
      matchScore: 91,
      coupon: 'DAIRY10',
      projectedCrossSales: 6400,
    },
    {
      merchantName: 'Urban Crust Bakery',
      category: 'Bakery',
      distanceKm: 1.2,
      matchScore: 88,
      coupon: 'BREAD15',
      projectedCrossSales: 5800,
    },
    {
      merchantName: 'Kumar Tea Corner',
      category: 'Beverages',
      distanceKm: 0.9,
      matchScore: 79,
      coupon: 'CHAI5',
      projectedCrossSales: 3100,
    },
  ],
};

export const demoVoiceNegotiation: VoiceNegotiationResult = {
  request: 'Need 10 boxes of Parle-G',
  quantity: 10,
  bestSupplier: 'NCR Wholesale Hub',
  totalSavings: 560,
  recommendation:
    'NCR Wholesale Hub gave the best landed rate with 6-hour delivery. Approve and pay to lock today rate.',
  quotes: [
    {
      supplier: 'NCR Wholesale Hub',
      openingQuotePerUnit: 238,
      negotiatedQuotePerUnit: 212,
      deliveryHours: 6,
      status: 'finalized',
    },
    {
      supplier: 'Raj Distribution',
      openingQuotePerUnit: 232,
      negotiatedQuotePerUnit: 218,
      deliveryHours: 10,
      status: 'finalized',
    },
    {
      supplier: 'Metro Foods Supply',
      openingQuotePerUnit: 246,
      negotiatedQuotePerUnit: 224,
      deliveryHours: 8,
      status: 'finalized',
    },
  ],
};

export const demoGenAIAdCampaign: GenAIAdCampaign = {
  productName: 'Premium Atta 5kg',
  headline: 'Fresh Stock Alert: Weekend Offer Live',
  headlineHindi: 'Naya Stock Aaya: Weekend Offer Live',
  body:
    'Premium Atta 5kg now at a limited 10% promo for regular customers. Tap to pay instantly and reserve before evening rush.',
  bodyHindi:
    'Premium Atta 5kg par limited 10% offer. Regular customers ke liye fast booking. Jaldi order karein.',
  offerText: 'SAVE10',
  whatsappMessage:
    'Namaste! Premium Atta 5kg par aaj 10% special offer hai. Is link se order karein: https://payassist.app/pay/offer-save10',
  targetRadiusKm: 5,
  projectedReach: 420,
  projectedRevenue: 27800,
  recommendation:
    'Push campaign between 6 PM and 8 PM for best conversion from repeat households.',
};
