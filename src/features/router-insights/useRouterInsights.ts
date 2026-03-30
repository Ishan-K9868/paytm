import { useMemo, useState } from 'react';
import { demoRecommendations, demoRouterInsights } from '@/data/demoAppData';

export function useRouterInsights() {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');

  const recommendations = useMemo(() => demoRecommendations, []);

  return { insights: demoRouterInsights, recommendations, dateRange, setDateRange };
}
