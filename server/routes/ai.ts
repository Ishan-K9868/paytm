import { Router } from 'express';
import { authenticate } from '../middleware/auth.ts';
import { demoRecommendations, voiceQueries } from '../../src/data/demoAppData.ts';
import {
  demoActionFeed,
  demoAutoSweepPlan,
  demoGenAIAdCampaign,
  demoVoiceNegotiation,
  demoVyaparSetuNetwork,
} from '../../src/data/copilotDemoData.ts';
import type {
  ActionFeedResponse,
  AutoSweepPlan,
  GenAIAdCampaign,
  VoiceNegotiationResult,
  VyaparSetuNetwork,
} from '../../src/types/copilot.types.ts';
import type { RoutingRecommendation, VoiceResponse } from '../../src/types/insights.types.ts';
import { generateGeminiText, hasGeminiConfig } from '../services/geminiService.ts';

export const aiRoutes = Router();

aiRoutes.use(authenticate);

function parseJson<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function fallbackVoiceResponse(query: string): VoiceResponse {
  return voiceQueries[query] ?? {
    answer: 'Demo mode could not match that exact question, but the app shell and AI route are now connected for the real implementation.',
    answerHindi: 'Demo mode ne exact sawaal match nahi kiya, lekin main aapko sahi workflow tak le ja sakta hoon.',
    dataPoints: [{ label: 'Mode', value: 'Demo', type: 'status' }],
    suggestedActions: [{ label: 'Open dashboard', route: '/app/dashboard' }],
    confidence: 'medium',
  };
}

function normalizeVoiceResponse(value: VoiceResponse, fallback: VoiceResponse): VoiceResponse {
  const dataPoints = Array.isArray(value.dataPoints)
    ? value.dataPoints.filter((item) => item && item.label && item.value && ['amount', 'count', 'status', 'date'].includes(item.type))
    : fallback.dataPoints;

  const suggestedActions = Array.isArray(value.suggestedActions)
    ? value.suggestedActions.filter((item) => item && item.label && typeof item.route === 'string' && item.route.startsWith('/app/'))
    : fallback.suggestedActions;

  const confidence = value.confidence === 'high' || value.confidence === 'low' || value.confidence === 'medium'
    ? value.confidence
    : fallback.confidence;

  return {
    answer: typeof value.answer === 'string' && value.answer.trim().length > 0 ? value.answer : fallback.answer,
    answerHindi: typeof value.answerHindi === 'string' && value.answerHindi.trim().length > 0 ? value.answerHindi : fallback.answerHindi,
    dataPoints: dataPoints.length > 0 ? dataPoints : fallback.dataPoints,
    suggestedActions: suggestedActions.length > 0 ? suggestedActions : fallback.suggestedActions,
    confidence,
  };
}

function normalizeRecommendations(value: unknown): RoutingRecommendation[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const allowedTypes = new Set<RoutingRecommendation['type']>(['promote', 'demote', 'watch', 'urgent']);

  return value
    .filter((item) => item && typeof item.paymentMethod === 'string' && typeof item.reason === 'string' && typeof item.impact === 'string')
    .map((item) => ({
      type: allowedTypes.has(item.type) ? item.type : 'watch',
      paymentMethod: item.paymentMethod,
      reason: item.reason,
      impact: item.impact,
      confidence: Math.max(0, Math.min(100, Number.isFinite(item.confidence) ? item.confidence : 50)),
    }));
}

aiRoutes.post('/explain-transaction', async (req, res) => {
  const txn = req.body?.txn;

  if (!txn) {
    res.json({ explanation: 'This payment is being explained in demo mode.' });
    return;
  }

  if (!hasGeminiConfig()) {
    res.json({ explanation: txn.aiExplanation ?? 'This payment is being explained in demo mode.' });
    return;
  }

  const prompt = `You are PayAssist, an AI payment operations copilot for Indian merchants.
Explain this transaction in simple English under 90 words.
Mention what happened, whether the merchant should trust the payment state, and the next action.
Do not use markdown.

Transaction:
- Order ID: ${txn.orderId ?? 'N/A'}
- Transaction ID: ${txn.txnId ?? 'N/A'}
- Amount: Rs. ${txn.txnAmount ?? 'N/A'}
- Status: ${txn.status ?? 'Unknown'}
- Payment Mode: ${txn.paymentMode ?? 'Unknown'}
- Response Message: ${txn.responseMsg ?? 'Unknown'}
- Settlement ETA: ${txn.settlementEta ?? 'Unknown'}
`;

  try {
    const explanation = await generateGeminiText(prompt);
    res.json({ explanation });
  } catch {
    res.json({ explanation: txn.aiExplanation ?? 'This payment is being explained in demo mode.' });
  }
});

aiRoutes.post('/draft-dispute', async (req, res) => {
  const dispute = req.body?.dispute;
  const txn = req.body?.txn;
  const disputeId = dispute?.id ?? 'demo';
  const fallbackDraft = `Dear Paytm Dispute Team, this is a demo-generated response for ${disputeId}. Our records indicate the original transaction completed successfully and the merchant requests review in its favour.`;

  if (!dispute || !txn || !hasGeminiConfig()) {
    res.json({ draft: fallbackDraft });
    return;
  }

  const prompt = `You are a payment dispute resolution assistant for an Indian merchant.
Write a professional dispute response letter between 170 and 240 words.
Use a factual and non-confrontational tone. Do not use markdown.

Dispute:
- Dispute ID: ${dispute.id}
- Order ID: ${dispute.orderId}
- Type: ${dispute.disputeType}
- Dispute Amount: Rs. ${dispute.disputeAmount}
- Raised At: ${dispute.raisedAt}
- Deadline: ${dispute.responseDeadline}

Transaction facts:
- Transaction Date: ${txn.txnDate ?? 'N/A'}
- Status: ${txn.status ?? 'N/A'}
- Transaction ID: ${txn.txnId ?? 'N/A'}
- Bank Transaction ID: ${txn.bankTxnId ?? 'N/A'}
- Payment Mode: ${txn.paymentMode ?? 'N/A'}
- Response Code: ${txn.responseCode ?? 'N/A'}
- Response Message: ${txn.responseMsg ?? 'N/A'}
`;

  try {
    const draft = await generateGeminiText(prompt);
    res.json({ draft });
  } catch {
    res.json({ draft: fallbackDraft });
  }
});

aiRoutes.post('/merchant-query', async (req, res) => {
  const query = String(req.body?.query ?? '').trim().toLowerCase();
  const fallback = fallbackVoiceResponse(query);

  if (!query || !hasGeminiConfig()) {
    res.json(fallback);
    return;
  }

  const prompt = `You are PayAssist, a bilingual AI copilot for Indian merchants using Paytm.
Answer the merchant query in simple, operational language.
Return JSON only in this exact shape:
{
  "answer": string,
  "answerHindi": string,
  "dataPoints": [{"label": string, "value": string, "type": "amount" | "count" | "status" | "date"}],
  "suggestedActions": [{"label": string, "route": string}],
  "confidence": "high" | "medium" | "low"
}

Rules:
- Keep response practical and action-first.
- Routes must be valid app routes and start with /app/.
- Include 2-4 data points and 1-3 suggested actions.

Merchant query: ${query}
Known context:
${JSON.stringify(req.body?.context ?? {}, null, 2)}
`;

  try {
    const raw = await generateGeminiText(prompt, { json: true });
    const parsed = parseJson<VoiceResponse>(raw, fallback);
    const response = normalizeVoiceResponse(parsed, fallback);
    res.json(response);
  } catch {
    res.json(fallback);
  }
});

aiRoutes.post('/eod-summary', async (req, res) => {
  const summaryData = req.body?.summary ?? req.body ?? {};
  const fallback = 'Today collections were strong, but a few anomalies still need attention before the books feel fully clean.';

  if (!hasGeminiConfig()) {
    res.json({ summary: fallback });
    return;
  }

  const prompt = `You are PayAssist writing an end-of-day summary for a merchant.
Write one concise operational summary paragraph in under 110 words.
Mention collections, settlement health, anomalies, and what should happen next.
Do not use markdown.

Summary data:
${JSON.stringify(summaryData, null, 2)}
`;

  try {
    const summary = await generateGeminiText(prompt);
    res.json({ summary });
  } catch {
    res.json({ summary: fallback });
  }
});

aiRoutes.post('/router-analysis', async (req, res) => {
  const insights = Array.isArray(req.body?.insights) ? req.body.insights : [];

  if (!insights.length || !hasGeminiConfig()) {
    res.json({ recommendations: demoRecommendations });
    return;
  }

  const prompt = `You are PayAssist analyzing payment router performance.
Return JSON only as an array of objects with this exact shape:
[{"type":"promote"|"demote"|"watch"|"urgent","paymentMethod":string,"reason":string,"impact":string,"confidence":number}]

Return 2 to 4 recommendations only.

Insights:
${JSON.stringify(insights, null, 2)}

Additional context:
${JSON.stringify(req.body?.context ?? {}, null, 2)}
`;

  try {
    const raw = await generateGeminiText(prompt, { json: true });
    const parsed = parseJson<unknown>(raw, demoRecommendations);
    const candidates = Array.isArray(parsed)
      ? parsed
      : (parsed && typeof parsed === 'object' && Array.isArray((parsed as { recommendations?: unknown }).recommendations)
          ? (parsed as { recommendations: unknown[] }).recommendations
          : []);
    const recommendations = normalizeRecommendations(candidates);
    res.json({ recommendations: recommendations.length > 0 ? recommendations : demoRecommendations });
  } catch {
    res.json({ recommendations: demoRecommendations });
  }
});

aiRoutes.post('/action-feed', async (req, res) => {
  const fallback: ActionFeedResponse = {
    ...demoActionFeed,
    generatedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
  };

  if (!hasGeminiConfig()) {
    res.json(fallback);
    return;
  }

  const profile = req.body?.profile ?? {};
  const stats = req.body?.stats ?? {};

  const prompt = `You are PayAssist Copilot for Indian merchants.
Generate a concise dashboard narrative (1-2 sentences) for today's action feed.
Focus on risk, liquidity, and growth actions.
Do not use markdown.

Merchant profile:
${JSON.stringify(profile, null, 2)}

Merchant stats:
${JSON.stringify(stats, null, 2)}
`;

  try {
    const narrative = await generateGeminiText(prompt);
    res.json({
      ...fallback,
      narrative,
    });
  } catch {
    res.json(fallback);
  }
});

aiRoutes.post('/auto-sweep-plan', async (req, res) => {
  const fallback: AutoSweepPlan = { ...demoAutoSweepPlan };
  const availableCash = Number(req.body?.availableCash ?? fallback.idleCash + 30000);
  const upcomingOutflow = Number(req.body?.upcomingOutflow ?? fallback.projectedOutflow);
  const projectedInflow = Number(req.body?.projectedInflow ?? fallback.projectedInflow);

  const requiredLiquidity = Math.max(25000, Math.round(upcomingOutflow * 1.25));
  const idleCash = Math.max(0, availableCash - requiredLiquidity);
  const sweepAmount = Math.max(0, Math.round(idleCash * 0.72));
  const expectedYield = Math.round((sweepAmount * 0.00088) * 10) / 10;

  res.json({
    ...fallback,
    requiredLiquidity,
    projectedInflow,
    projectedOutflow: upcomingOutflow,
    idleCash,
    sweepAmount,
    expectedYield,
    recommendation: sweepAmount > 0
      ? `Sweep Rs. ${sweepAmount.toLocaleString('en-IN')} into overnight fund and keep Rs. ${(availableCash - sweepAmount).toLocaleString('en-IN')} liquid for supplier and payout obligations.`
      : 'No safe surplus available for sweep today. Keep full cash position liquid.',
  } satisfies AutoSweepPlan);
});

aiRoutes.post('/vyapar-setu-network', async (_req, res) => {
  const fallback: VyaparSetuNetwork = { ...demoVyaparSetuNetwork };

  if (!hasGeminiConfig()) {
    res.json(fallback);
    return;
  }

  const prompt = `Write one concise recommendation sentence for a hyperlocal merchant cross-sell network.
Use practical language and mention evening peak if relevant.
Do not use markdown.`;

  try {
    const recommendation = await generateGeminiText(prompt);
    res.json({
      ...fallback,
      recommendation,
    });
  } catch {
    res.json(fallback);
  }
});

aiRoutes.post('/voice-negotiation', async (req, res) => {
  const requestText = String(req.body?.request ?? demoVoiceNegotiation.request).trim() || demoVoiceNegotiation.request;
  const quantity = Math.max(1, Number(req.body?.quantity ?? demoVoiceNegotiation.quantity));

  const normalizedQuotes = demoVoiceNegotiation.quotes.map((quote) => ({
    ...quote,
    openingQuotePerUnit: Math.round(quote.openingQuotePerUnit * (0.98 + Math.random() * 0.04)),
    negotiatedQuotePerUnit: Math.round(quote.negotiatedQuotePerUnit * (0.98 + Math.random() * 0.04)),
  }));

  const sorted = [...normalizedQuotes].sort((a, b) => a.negotiatedQuotePerUnit - b.negotiatedQuotePerUnit);
  const best = sorted[0];
  const baseline = sorted[sorted.length - 1];
  const totalSavings = Math.max(0, (baseline.negotiatedQuotePerUnit - best.negotiatedQuotePerUnit) * quantity);

  res.json({
    request: requestText,
    quantity,
    quotes: normalizedQuotes,
    bestSupplier: best.supplier,
    totalSavings,
    recommendation: `${best.supplier} secured the lowest negotiated rate. Approve to lock this quote before distributor refresh window.`,
  } satisfies VoiceNegotiationResult);
});

aiRoutes.post('/genai-ad-campaign', async (req, res) => {
  const productName = String(req.body?.productName ?? demoGenAIAdCampaign.productName).trim() || demoGenAIAdCampaign.productName;

  const fallback: GenAIAdCampaign = {
    ...demoGenAIAdCampaign,
    productName,
  };

  if (!hasGeminiConfig()) {
    res.json(fallback);
    return;
  }

  const prompt = `You are a growth copilot for an Indian neighborhood merchant.
Generate JSON only with this exact shape:
{
  "headline": string,
  "headlineHindi": string,
  "body": string,
  "bodyHindi": string,
  "offerText": string,
  "whatsappMessage": string,
  "recommendation": string
}

Product name: ${productName}
Goal: clear slow-moving inventory with a local WhatsApp-first campaign.
Tone: short, friendly, action-first.
`;

  try {
    const raw = await generateGeminiText(prompt, { json: true });
    const parsed = parseJson<Partial<GenAIAdCampaign>>(raw, fallback);
    res.json({
      ...fallback,
      headline: parsed.headline?.trim() ? parsed.headline : fallback.headline,
      headlineHindi: parsed.headlineHindi?.trim() ? parsed.headlineHindi : fallback.headlineHindi,
      body: parsed.body?.trim() ? parsed.body : fallback.body,
      bodyHindi: parsed.bodyHindi?.trim() ? parsed.bodyHindi : fallback.bodyHindi,
      offerText: parsed.offerText?.trim() ? parsed.offerText : fallback.offerText,
      whatsappMessage: parsed.whatsappMessage?.trim() ? parsed.whatsappMessage : fallback.whatsappMessage,
      recommendation: parsed.recommendation?.trim() ? parsed.recommendation : fallback.recommendation,
    } satisfies GenAIAdCampaign);
  } catch {
    res.json(fallback);
  }
});
