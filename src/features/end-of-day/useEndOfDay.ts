import { useState } from 'react';
import { demoAnalytics, demoDisputes, demoReconciliationSummary } from '@/data/demoAppData';
import { geminiClient } from '@/lib/gemini';

const fallbackSummary = 'Today you collected Rs. 13,760 across 6 tracked payment events, with most clean volume coming through UPI and QR. Two reconciliation anomalies remain open, so the day is financially close but not fully balanced yet. Resolve the short settlement deltas before declaring the books completely clean.';

export function useEndOfDay(step: number) {
  const [summaryText, setSummaryText] = useState(fallbackSummary);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    setIsGenerating(true);
    try {
      const text = await geminiClient
      .generateEODSummary({
        date: demoReconciliationSummary.date,
        totalCollected: demoReconciliationSummary.totalCollected,
        totalSettled: demoReconciliationSummary.totalSettled,
        anomalyCount: demoReconciliationSummary.anomalyCount,
        openDisputes: demoDisputes.filter((item) => !item.status.startsWith('resolved')).length,
        successRate: demoAnalytics.avgSuccessRate,
        merchantGoal: 'Close the day confidently and know what needs follow-up tomorrow.',
      });
      setSummaryText(text);
    } catch {
      setSummaryText(fallbackSummary);
    } finally {
      setIsGenerating(false);
    }
  };

  return { summaryText, isGenerating: step === 1 && isGenerating, generateSummary };
}
