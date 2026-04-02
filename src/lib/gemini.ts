import { demoRecommendations, voiceQueries } from '@/data/demoAppData';
import {
  demoActionFeed,
  demoAutoSweepPlan,
  demoGenAIAdCampaign,
  demoVoiceNegotiation,
  demoVyaparSetuNetwork,
} from '@/data/copilotDemoData';
import type {
  ActionFeedResponse,
  AutoSweepPlan,
  GenAIAdCampaign,
  VoiceNegotiationResult,
} from '@/types/copilot.types';
import type { Dispute } from '@/types/dispute.types';
import type { RouterInsight } from '@/types/insights.types';
import type { TransactionVerification } from '@/types/payment.types';

export const geminiClient = {
  async explainTransaction(txn: TransactionVerification, locale: 'hi' | 'en', context?: { expectedAmount?: string; hasAnomaly?: boolean; merchantQuestion?: string }) {
    void locale;
    void context;
    return txn.aiExplanation ?? 'This payment has been interpreted in demo mode.';
  },

  async draftDisputeResponse(context: { dispute: Dispute; txn: TransactionVerification }) {
    return context.dispute.aiDraft
      ?? 'Dear Paytm Dispute Team, our merchant ledger and gateway response confirm that this transaction was processed successfully. The payment record contains the relevant transaction and bank reference details, and there is no contrary refund or reversal instruction recorded on our side. We request that the case be reviewed against the available payment facts and resolved in the merchant\'s favour. Please let us know if any further supporting details are required from our side.';
  },

  async answerMerchantQuery(query: string, context?: Record<string, unknown>) {
    void context;
    return voiceQueries[query] ?? {
      answer: 'I could not fully classify that question, but I can still point you to the right workflow.',
      answerHindi: 'Main is sawaal ko poori tarah classify nahi kar saka, lekin sahi workflow tak le ja sakta hoon.',
      dataPoints: [{ label: 'Mode', value: 'AI fallback', type: 'status' }],
      suggestedActions: [{ label: 'Open dashboard', route: '/app/dashboard' }],
      confidence: 'medium',
    };
  },

  async generateEODSummary(summary: Record<string, unknown>) {
    void summary;
    return 'Today collections were strong, but a few anomalies still need attention before the books feel fully clean.';
  },

  async analyzeRouterInsights(insights: RouterInsight[], context?: Record<string, unknown>) {
    void insights;
    void context;
    return demoRecommendations;
  },

  async getActionFeed(context?: Record<string, unknown>) {
    void context;
    return {
      ...demoActionFeed,
      generatedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    } satisfies ActionFeedResponse;
  },

  async getAutoSweepPlan(context?: { availableCash?: number; projectedInflow?: number; upcomingOutflow?: number }) {
    const base = { ...demoAutoSweepPlan };
    const availableCash = Number(context?.availableCash ?? base.idleCash + 30000);
    const upcomingOutflow = Number(context?.upcomingOutflow ?? base.projectedOutflow);
    const projectedInflow = Number(context?.projectedInflow ?? base.projectedInflow);

    const requiredLiquidity = Math.max(25000, Math.round(upcomingOutflow * 1.25));
    const idleCash = Math.max(0, availableCash - requiredLiquidity);
    const sweepAmount = Math.max(0, Math.round(idleCash * 0.72));
    const expectedYield = Math.round((sweepAmount * 0.00088) * 10) / 10;

    return {
      ...base,
      requiredLiquidity,
      projectedInflow,
      projectedOutflow: upcomingOutflow,
      idleCash,
      sweepAmount,
      expectedYield,
      recommendation: sweepAmount > 0
        ? `Sweep Rs. ${sweepAmount.toLocaleString('en-IN')} into overnight fund and keep Rs. ${(availableCash - sweepAmount).toLocaleString('en-IN')} liquid for supplier and payout obligations.`
        : 'No safe surplus available for sweep today. Keep full cash position liquid.',
    } satisfies AutoSweepPlan;
  },

  async getVyaparSetuNetwork(context?: Record<string, unknown>) {
    void context;
    return demoVyaparSetuNetwork;
  },

  async runVoiceNegotiation(input?: { request?: string; quantity?: number }) {
    const requestText = String(input?.request ?? demoVoiceNegotiation.request).trim() || demoVoiceNegotiation.request;
    const quantity = Math.max(1, Number(input?.quantity ?? demoVoiceNegotiation.quantity));

    const quotes = demoVoiceNegotiation.quotes.map((quote) => ({
      ...quote,
      openingQuotePerUnit: Math.round(quote.openingQuotePerUnit * (0.98 + Math.random() * 0.04)),
      negotiatedQuotePerUnit: Math.round(quote.negotiatedQuotePerUnit * (0.98 + Math.random() * 0.04)),
    }));

    const sorted = [...quotes].sort((a, b) => a.negotiatedQuotePerUnit - b.negotiatedQuotePerUnit);
    const best = sorted[0];
    const baseline = sorted[sorted.length - 1];
    const totalSavings = Math.max(0, (baseline.negotiatedQuotePerUnit - best.negotiatedQuotePerUnit) * quantity);

    return {
      request: requestText,
      quantity,
      quotes,
      bestSupplier: best.supplier,
      totalSavings,
      recommendation: `${best.supplier} secured the lowest negotiated rate. Approve to lock this quote before distributor refresh window.`,
    } satisfies VoiceNegotiationResult;
  },

  async generateAdCampaign(input?: { productName?: string }) {
    const productName = String(input?.productName ?? demoGenAIAdCampaign.productName).trim() || demoGenAIAdCampaign.productName;
    return {
      ...demoGenAIAdCampaign,
      productName,
    } satisfies GenAIAdCampaign;
  },
};
