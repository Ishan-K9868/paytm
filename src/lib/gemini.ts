import { demoRecommendations, voiceQueries } from '@/data/demoAppData';
import type { Dispute } from '@/types/dispute.types';
import type { RouterInsight, RoutingRecommendation, VoiceResponse } from '@/types/insights.types';
import type { TransactionVerification } from '@/types/payment.types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL ?? 'gemini-1.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

function hasGeminiKey() {
  return Boolean(GEMINI_API_KEY && GEMINI_API_KEY.trim().length > 0);
}

async function generateText(prompt: string, json = false) {
  if (!hasGeminiKey()) {
    throw new Error('Gemini key missing');
  }

  const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: json
        ? {
            temperature: 0.5,
            responseMimeType: 'application/json',
          }
        : {
            temperature: 0.6,
          },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed with ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? '').join('')?.trim();

  if (!text) {
    throw new Error('Empty Gemini response');
  }

  return text;
}

function parseJson<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const geminiClient = {
  async explainTransaction(txn: TransactionVerification, locale: 'hi' | 'en', context?: { expectedAmount?: string; hasAnomaly?: boolean; merchantQuestion?: string }) {
    try {
      const prompt = `You are PayAssist, an AI payment operations copilot for Indian merchants.
Explain this payment clearly in ${locale === 'hi' ? 'simple Hindi or Hinglish' : 'simple English'}.
Keep it under 90 words. Mention what happened, whether the merchant should trust the payment state, and the next action.

Transaction:
- Order ID: ${txn.orderId}
- Transaction ID: ${txn.txnId ?? 'N/A'}
- Amount: Rs. ${txn.txnAmount}
- Status: ${txn.status}
- Payment Mode: ${txn.paymentMode}
- Response Message: ${txn.responseMsg}
- Settlement ETA: ${txn.settlementEta ?? 'Unknown'}
- Expected amount supplied by merchant: ${context?.expectedAmount ?? 'Not provided'}
- Amount anomaly detected: ${context?.hasAnomaly ? 'Yes' : 'No'}
- Merchant question: ${context?.merchantQuestion ?? 'Did we receive this payment?'}
`;

      return await generateText(prompt);
    } catch {
      return txn.aiExplanation ?? 'This payment has been interpreted in demo mode.';
    }
  },

  async draftDisputeResponse(context: { dispute: Dispute; txn: TransactionVerification }) {
    try {
      const prompt = `You are a payment dispute resolution assistant for an Indian merchant.
Write a professional dispute response letter between 170 and 240 words.
Use a factual and non-confrontational tone.
Do not use markdown.

Dispute:
- Dispute ID: ${context.dispute.id}
- Order ID: ${context.dispute.orderId}
- Type: ${context.dispute.disputeType}
- Amount: Rs. ${context.dispute.disputeAmount}
- Raised At: ${context.dispute.raisedAt}
- Deadline: ${context.dispute.responseDeadline}

Transaction facts:
- Transaction Date: ${context.txn.txnDate}
- Status: ${context.txn.status}
- Transaction ID: ${context.txn.txnId ?? 'N/A'}
- Bank Transaction ID: ${context.txn.bankTxnId ?? 'N/A'}
- Payment Mode: ${context.txn.paymentMode}
- Response Code: ${context.txn.responseCode}
- Response Message: ${context.txn.responseMsg}
`;

      return await generateText(prompt);
    } catch {
      return 'Dear Paytm Dispute Team, our merchant ledger and gateway response confirm that this transaction was processed successfully. The payment record contains the relevant transaction and bank reference details, and there is no contrary refund or reversal instruction recorded on our side. We request that the case be reviewed against the available payment facts and resolved in the merchant\'s favour. Please let us know if any further supporting details are required from our side.';
    }
  },

  async answerMerchantQuery(query: string, context?: Record<string, unknown>) {
    try {
      const prompt = `You are PayAssist, a bilingual AI copilot for Indian merchants using Paytm.
Answer the merchant query using a confident but careful operational tone.
Return JSON only with this exact shape:
{
  "answer": string,
  "answerHindi": string,
  "dataPoints": [{"label": string, "value": string, "type": "amount" | "count" | "status" | "date"}],
  "suggestedActions": [{"label": string, "route": string}],
  "confidence": "high" | "medium" | "low"
}

Known app routes you may use:
/app/dashboard
/app/verify
/app/reconciliation
/app/disputes
/app/voice
/app/router-insights
/app/end-of-day
/app/analytics
/app/notifications
/app/payment-links
/app/settings

Merchant query: ${query}

Known app context:
${JSON.stringify(context ?? {}, null, 2)}`;

      const raw = await generateText(prompt, true);
      return parseJson<VoiceResponse>(raw, voiceQueries[query] ?? {
        answer: 'I could not fully classify that question, but I can still point you to the right workflow.',
        answerHindi: 'Main is sawaal ko poori tarah classify nahi kar saka, lekin sahi workflow tak le ja sakta hoon.',
        dataPoints: [{ label: 'Mode', value: 'AI fallback', type: 'status' }],
        suggestedActions: [{ label: 'Open dashboard', route: '/app/dashboard' }],
        confidence: 'medium',
      });
    } catch {
      return voiceQueries[query] ?? {
        answer: 'I could not match that exact merchant question in demo mode, but I can still route you to the right workflow.',
        answerHindi: 'Exact sawaal match nahi hua, lekin main aapko sahi workflow dikha sakta hoon.',
        dataPoints: [{ label: 'Mode', value: 'Demo', type: 'status' }],
        suggestedActions: [{ label: 'Open dashboard', route: '/app/dashboard' }],
        confidence: 'medium',
      };
    }
  },

  async generateEODSummary(summary: Record<string, unknown>) {
    try {
      const prompt = `You are PayAssist writing an end-of-day summary for a merchant.
Write one concise operational summary paragraph in under 110 words.
Mention collections, settlement health, anomalies, and what should happen next.

Summary data:
${JSON.stringify(summary, null, 2)}`;

      return await generateText(prompt);
    } catch {
      return 'Today collections were strong, but a few anomalies still need attention before the books feel fully clean.';
    }
  },

  async analyzeRouterInsights(insights: RouterInsight[], context?: Record<string, unknown>) {
    try {
      const prompt = `You are PayAssist analyzing payment router performance.
Return JSON only as an array of recommendation objects with this shape:
[{"type":"promote"|"demote"|"watch"|"urgent","paymentMethod":string,"reason":string,"impact":string,"confidence":number}]

Insights:
${JSON.stringify(insights, null, 2)}

Additional context:
${JSON.stringify(context ?? {}, null, 2)}

Return 2 to 4 recommendations only.`;

      const raw = await generateText(prompt, true);
      return parseJson<RoutingRecommendation[]>(raw, demoRecommendations);
    } catch {
      return demoRecommendations;
    }
  },
};
