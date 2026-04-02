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
  VyaparSetuNetwork,
} from '@/types/copilot.types';
import type { Dispute } from '@/types/dispute.types';
import type { RouterInsight, RoutingRecommendation, VoiceResponse } from '@/types/insights.types';
import type { TransactionVerification } from '@/types/payment.types';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
const BACKEND_FAILURE_COOLDOWN_MS = 90000;

let backendHealth: { state: 'unknown' | 'up' | 'down'; checkedAt: number } = {
  state: 'unknown',
  checkedAt: 0,
};

function withTimeout<T>(promise: Promise<T>, timeoutMs = 3500) {
  return new Promise<T>((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
    promise
      .then((value) => {
        window.clearTimeout(timeout);
        resolve(value);
      })
      .catch((error) => {
        window.clearTimeout(timeout);
        reject(error);
      });
  });
}

function toApiUrl(path: string) {
  return API_BASE ? `${API_BASE}${path}` : path;
}

async function postToAI<T>(path: string, payload: Record<string, unknown>) {
  const now = Date.now();
  if (backendHealth.state === 'down' && now - backendHealth.checkedAt < BACKEND_FAILURE_COOLDOWN_MS) {
    throw new Error('Backend unavailable');
  }

  try {
    const response = await withTimeout(fetch(toApiUrl(path), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-payassist-auth-mode': 'demo',
      },
      body: JSON.stringify(payload),
    }), 6000);

    if (!response.ok) {
      throw new Error(`API error ${response.status}`);
    }

    backendHealth = { state: 'up', checkedAt: now };
    return await response.json() as T;
  } catch (error) {
    backendHealth = { state: 'down', checkedAt: now };
    throw error;
  }
}

export const geminiClient = {
  async explainTransaction(txn: TransactionVerification, locale: 'hi' | 'en', context?: { expectedAmount?: string; hasAnomaly?: boolean; merchantQuestion?: string }) {
    try {
      const result = await postToAI<{ explanation?: string }>('/api/ai/explain-transaction', {
        txn,
        locale,
        context,
      });
      if (typeof result.explanation === 'string' && result.explanation.trim().length > 0) {
        return result.explanation;
      }
      throw new Error('No explanation returned');
    } catch {
      return txn.aiExplanation ?? 'This payment has been interpreted in demo mode.';
    }
  },

  async draftDisputeResponse(context: { dispute: Dispute; txn: TransactionVerification }) {
    try {
      const result = await postToAI<{ draft?: string }>('/api/ai/draft-dispute', context);
      if (typeof result.draft === 'string' && result.draft.trim().length > 0) {
        return result.draft;
      }
      throw new Error('No draft returned');
    } catch {
      return 'Dear Paytm Dispute Team, our merchant ledger and gateway response confirm that this transaction was processed successfully. The payment record contains the relevant transaction and bank reference details, and there is no contrary refund or reversal instruction recorded on our side. We request that the case be reviewed against the available payment facts and resolved in the merchant\'s favour. Please let us know if any further supporting details are required from our side.';
    }
  },

  async answerMerchantQuery(query: string, context?: Record<string, unknown>) {
    try {
      const result = await postToAI<VoiceResponse>('/api/ai/merchant-query', { query, context });
      if (!result || typeof result.answer !== 'string' || !Array.isArray(result.dataPoints) || !Array.isArray(result.suggestedActions)) {
        throw new Error('Invalid voice response');
      }
      return result;
    } catch {
      return voiceQueries[query] ?? {
        answer: 'I could not fully classify that question, but I can still point you to the right workflow.',
        answerHindi: 'Main is sawaal ko poori tarah classify nahi kar saka, lekin sahi workflow tak le ja sakta hoon.',
        dataPoints: [{ label: 'Mode', value: 'AI fallback', type: 'status' }],
        suggestedActions: [{ label: 'Open dashboard', route: '/app/dashboard' }],
        confidence: 'medium',
      };
    }
  },

  async generateEODSummary(summary: Record<string, unknown>) {
    try {
      const result = await postToAI<{ summary?: string }>('/api/ai/eod-summary', { summary });
      if (typeof result.summary === 'string' && result.summary.trim().length > 0) {
        return result.summary;
      }
      throw new Error('No summary returned');
    } catch {
      return 'Today collections were strong, but a few anomalies still need attention before the books feel fully clean.';
    }
  },

  async analyzeRouterInsights(insights: RouterInsight[], context?: Record<string, unknown>) {
    try {
      const result = await postToAI<{ recommendations?: RoutingRecommendation[] }>('/api/ai/router-analysis', {
        insights,
        context,
      });
      if (Array.isArray(result.recommendations) && result.recommendations.length > 0) {
        return result.recommendations;
      }
      throw new Error('No recommendations returned');
    } catch {
      return demoRecommendations;
    }
  },

  async getActionFeed(context?: Record<string, unknown>) {
    try {
      const result = await postToAI<ActionFeedResponse>('/api/ai/action-feed', context ?? {});
      if (Array.isArray(result.actions) && result.actions.length > 0) {
        return result;
      }
      throw new Error('No actions returned');
    } catch {
      return demoActionFeed;
    }
  },

  async getAutoSweepPlan(context?: { availableCash?: number; projectedInflow?: number; upcomingOutflow?: number }) {
    try {
      const result = await postToAI<AutoSweepPlan>('/api/ai/auto-sweep-plan', context ?? {});
      if (typeof result.sweepAmount === 'number') {
        return result;
      }
      throw new Error('No sweep plan returned');
    } catch {
      return demoAutoSweepPlan;
    }
  },

  async getVyaparSetuNetwork(context?: Record<string, unknown>) {
    try {
      const result = await postToAI<VyaparSetuNetwork>('/api/ai/vyapar-setu-network', context ?? {});
      if (Array.isArray(result.partners) && result.partners.length > 0) {
        return result;
      }
      throw new Error('No vyapar setu data returned');
    } catch {
      return demoVyaparSetuNetwork;
    }
  },

  async runVoiceNegotiation(input?: { request?: string; quantity?: number }) {
    try {
      const result = await postToAI<VoiceNegotiationResult>('/api/ai/voice-negotiation', input ?? {});
      if (Array.isArray(result.quotes) && result.quotes.length > 0) {
        return result;
      }
      throw new Error('No negotiation result returned');
    } catch {
      return demoVoiceNegotiation;
    }
  },

  async generateAdCampaign(input?: { productName?: string }) {
    try {
      const result = await postToAI<GenAIAdCampaign>('/api/ai/genai-ad-campaign', input ?? {});
      if (typeof result.headline === 'string' && result.headline.trim().length > 0) {
        return result;
      }
      throw new Error('No campaign result returned');
    } catch {
      return demoGenAIAdCampaign;
    }
  },
};
