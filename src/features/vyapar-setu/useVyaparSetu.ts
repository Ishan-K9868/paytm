import { useEffect, useState } from 'react';
import { demoVyaparSetuNetwork } from '@/data/copilotDemoData';
import { geminiClient } from '@/lib/gemini';
import type { VyaparSetuNetwork } from '@/types/copilot.types';

export function useVyaparSetu() {
  const [network, setNetwork] = useState<VyaparSetuNetwork>(demoVyaparSetuNetwork);
  const [loading, setLoading] = useState(true);
  const [approvedCoupons, setApprovedCoupons] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    void geminiClient
      .getVyaparSetuNetwork({
        merchantCity: 'Noida',
        clusterType: 'daily essentials',
      })
      .then((result) => {
        if (!cancelled) {
          setNetwork(result);
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

  const approveCoupon = (coupon: string) => {
    setApprovedCoupons((current) => (current.includes(coupon) ? current : [...current, coupon]));
  };

  return { network, loading, approvedCoupons, approveCoupon };
}
