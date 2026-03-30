import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const isOnboarded = useAuthStore((state) => state.isOnboarded);
  const isAuthResolved = useAuthStore((state) => state.isAuthResolved);

  if (!isAuthResolved) {
    return <div className="route-loading">Restoring workspace...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;
  }

  if (!isOnboarded) {
    return <Navigate to="/auth/onboarding" replace />;
  }

  return <>{children}</>;
}
