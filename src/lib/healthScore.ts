import type { AnalyticsData } from '@/types/insights.types';

export function computeHealthScore(data: AnalyticsData): number {
  const successScore = data.avgSuccessRate;
  const disputeScore = Math.max(0, 100 - data.disputeRatio * 100);
  const settlementScore = data.avgSettlementDays <= 2 ? 100 : Math.max(0, 100 - (data.avgSettlementDays - 2) * 20);
  const anomalyScore = Math.max(0, 100 - data.anomalyRate * 200);

  return Math.round(
    successScore * 0.4 +
      disputeScore * 0.25 +
      settlementScore * 0.2 +
      anomalyScore * 0.15
  );
}
