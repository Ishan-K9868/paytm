import { useEffect, useState } from 'react';
import { demoAutoSweepPlan } from '@/data/copilotDemoData';
import { geminiClient } from '@/lib/gemini';
import type { AutoSweepPlan } from '@/types/copilot.types';

export function useAutoSweep() {
  const [plan, setPlan] = useState<AutoSweepPlan>(demoAutoSweepPlan);
  const [loading, setLoading] = useState(true);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    void geminiClient
      .getAutoSweepPlan({
        availableCash: 98000,
        projectedInflow: 126000,
        upcomingOutflow: 54000,
      })
      .then((result) => {
        if (!cancelled) {
          setPlan(result);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { plan, loading, approved, setApproved };
}
