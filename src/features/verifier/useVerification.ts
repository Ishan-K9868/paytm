import { useMemo, useState } from 'react';
import { geminiClient } from '@/lib/gemini';
import { paytmClient } from '@/lib/paytm';
import { demoTransactions } from '@/data/demoAppData';
import type { TransactionVerification, VerifierState } from '@/types/payment.types';

interface VerifyParams {
  orderId: string;
  txnAmount?: string;
}

export function useVerification() {
  const [state, setState] = useState<VerifierState>('idle');
  const [result, setResult] = useState<TransactionVerification | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentIds, setRecentIds] = useState<string[]>(Object.keys(demoTransactions));

  const verify = async ({ orderId, txnAmount }: VerifyParams) => {
    const normalizedOrderId = orderId.trim();
    setState('scanning');
    setResult(null);
    setError(null);

    await new Promise((resolve) => window.setTimeout(resolve, 1600));

    let data: TransactionVerification | undefined = demoTransactions[normalizedOrderId];

    if (!data) {
      try {
        data = await paytmClient.verifyTransaction(normalizedOrderId);
      } catch {
        data = undefined;
      }
    }

    if (!data) {
      setState('not_found');
      setError('No transaction found for this ID in demo mode.');
      return;
    }

    const expectedAmount = txnAmount?.trim() ? Number(txnAmount) : undefined;
    const actualAmount = Number(data.txnAmount);
    const hasAnomaly = typeof expectedAmount === 'number' && !Number.isNaN(expectedAmount) && expectedAmount !== actualAmount;
    let explanation = data.aiExplanation;
    try {
      explanation = await geminiClient.explainTransaction(data, 'en');
    } catch {
      explanation = data.aiExplanation;
    }

    const enriched = {
      ...data,
      aiExplanation: explanation,
      expectedAmount: txnAmount,
      hasAnomaly,
    } satisfies TransactionVerification;

    setResult(enriched);
    setRecentIds((current) => [normalizedOrderId, ...current.filter((id) => id !== normalizedOrderId)].slice(0, 5));

    if (hasAnomaly) {
      setState('anomaly');
      return;
    }

    if (data.status === 'TXN_SUCCESS') {
      setState('verified');
      return;
    }

    if (data.status === 'TXN_FAILURE') {
      setState('failed');
      return;
    }

    setState('verified');
  };

  const recentItems = useMemo(
    () => recentIds.map((id) => demoTransactions[id]).filter(Boolean),
    [recentIds]
  );

  const reset = () => {
    setState('idle');
    setResult(null);
    setError(null);
  };

  return { state, result, error, verify, reset, recentItems };
}
