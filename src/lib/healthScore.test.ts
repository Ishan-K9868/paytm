import { describe, expect, it } from 'vitest';
import { computeHealthScore } from '@/lib/healthScore';

describe('computeHealthScore', () => {
  it('returns a rounded weighted score', () => {
    const score = computeHealthScore({
      avgSuccessRate: 94,
      disputeRatio: 0.02,
      avgSettlementDays: 1.8,
      anomalyRate: 0.03,
      volume: [],
      successTrend: [],
      methodMix: [],
      settlementLag: [],
      insights: [],
    });

    expect(score).toBeGreaterThan(80);
    expect(score).toBeLessThanOrEqual(100);
  });
});
