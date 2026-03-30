import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppUser } from '@/types/merchant.types';

interface AuthState {
  user: AppUser | null;
  merchantId: string | null;
  isOnboarded: boolean;
  authMode: 'demo' | 'firebase';
  isAuthResolved: boolean;
  setUser: (user: AppUser | null) => void;
  setMerchantId: (merchantId: string) => void;
  setOnboarded: (value: boolean) => void;
  setAuthMode: (mode: 'demo' | 'firebase') => void;
  setAuthResolved: (value: boolean) => void;
  loginDemo: (payload: { email: string; displayName: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      merchantId: null,
      isOnboarded: false,
      authMode: 'demo',
      isAuthResolved: false,
      setUser: (user) => set({ user }),
      setMerchantId: (merchantId) => set({ merchantId }),
      setOnboarded: (isOnboarded) => set({ isOnboarded }),
      setAuthMode: (authMode) => set({ authMode }),
      setAuthResolved: (isAuthResolved) => set({ isAuthResolved }),
      loginDemo: ({ email, displayName }) =>
        set({
          authMode: 'demo',
          isAuthResolved: true,
          user: {
            uid: 'demo-merchant-user',
            email,
            displayName,
          },
        }),
      logout: () => set({ user: null, merchantId: null, isOnboarded: false, authMode: 'demo', isAuthResolved: true }),
    }),
    {
      name: 'payassist-auth',
    }
  )
);
