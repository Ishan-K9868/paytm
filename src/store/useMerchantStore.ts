import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MerchantProfile, TodayStats } from '@/types/merchant.types';

interface MerchantState {
  profile: MerchantProfile | null;
  todayStats: TodayStats | null;
  healthScore: number | null;
  setProfile: (profile: MerchantProfile) => void;
  setTodayStats: (todayStats: TodayStats) => void;
  setHealthScore: (healthScore: number) => void;
  seedDemoData: () => void;
}

const demoProfile: MerchantProfile = {
  businessName: 'Agarwal Home Needs',
  businessCategory: 'Retail',
  city: 'Noida',
  phoneNumber: '9876543210',
  merchantId: 'PAYAID001',
};

const demoStats: TodayStats = {
  totalCollected: 124320,
  totalSettled: 119480,
  transactionCount: 184,
  anomalyCount: 3,
  pendingDisputes: 2,
  successRate: 96.8,
};

export const useMerchantStore = create<MerchantState>()(
  persist(
    (set, get) => ({
      profile: null,
      todayStats: null,
      healthScore: null,
      setProfile: (profile) => set({ profile }),
      setTodayStats: (todayStats) => set({ todayStats }),
      setHealthScore: (healthScore) => set({ healthScore }),
      seedDemoData: () => {
        if (get().profile && get().todayStats && get().healthScore !== null) return;
        set({ profile: demoProfile, todayStats: demoStats, healthScore: 88 });
      },
    }),
    { name: 'payassist-merchant' }
  )
);
