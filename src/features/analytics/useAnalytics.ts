import { demoAnalytics } from '@/data/demoAppData';
import { computeHealthScore } from '@/lib/healthScore';

export function useAnalytics() {
  return {
    data: demoAnalytics,
    healthScore: computeHealthScore(demoAnalytics),
  };
}
