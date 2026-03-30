import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export function useAuthBootstrap() {
  const setAuthMode = useAuthStore((state) => state.setAuthMode);
  const setAuthResolved = useAuthStore((state) => state.setAuthResolved);

  useEffect(() => {
    setAuthMode('demo');
    setAuthResolved(true);
  }, [setAuthMode, setAuthResolved]);
}
