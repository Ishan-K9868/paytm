import { useEffect, useState } from 'react';
import { demoRecommendations, demoRouterInsights } from '@/data/demoAppData';
import { geminiClient } from '@/lib/gemini';

export function useRouterInsights() {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [recommendations, setRecommendations] = useState(demoRecommendations);

  useEffect(() => {
    let cancelled = false;

    void geminiClient
      .analyzeRouterInsights(demoRouterInsights, {
        selectedRange: dateRange,
        merchantIntent: 'Recommend what payment methods to promote or demote.',
      })
      .then((result) => {
        if (!cancelled && result.length > 0) {
          setRecommendations(result);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRecommendations(demoRecommendations);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [dateRange]);

  return { insights: demoRouterInsights, recommendations, dateRange, setDateRange };
}
