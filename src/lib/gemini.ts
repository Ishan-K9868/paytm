import { api } from '@/lib/axiosInstance';
import type { Dispute } from '@/types/dispute.types';
import type { RouterInsight, RoutingRecommendation, VoiceResponse } from '@/types/insights.types';
import type { TransactionVerification } from '@/types/payment.types';

export const geminiClient = {
  async explainTransaction(txn: TransactionVerification, locale: 'hi' | 'en') {
    const { data } = await api.post('/ai/explain-transaction', { txn, locale });
    return data.explanation as string;
  },
  async draftDisputeResponse(context: { dispute: Dispute; txn: TransactionVerification }) {
    const { data } = await api.post('/ai/draft-dispute', context);
    return data.draft as string;
  },
  async answerMerchantQuery(query: string) {
    const { data } = await api.post('/ai/merchant-query', { query });
    return data as VoiceResponse;
  },
  async generateEODSummary(summary: Record<string, unknown>) {
    const { data } = await api.post('/ai/eod-summary', { summary });
    return data.summary as string;
  },
  async analyzeRouterInsights(insights: RouterInsight[]) {
    const { data } = await api.post('/ai/router-analysis', { insights });
    return data.recommendations as RoutingRecommendation[];
  },
};
