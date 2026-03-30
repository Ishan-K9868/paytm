import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';

export function useAuth() {
  const setUser = useAuthStore((state) => state.setUser);
  const setOnboarded = useAuthStore((state) => state.setOnboarded);
  const setAuthMode = useAuthStore((state) => state.setAuthMode);
  const setAuthResolved = useAuthStore((state) => state.setAuthResolved);
  const logoutStore = useAuthStore((state) => state.logout);

  const login = async (email: string, password: string) => {
    setUser({
      uid: 'local-merchant-user',
      email,
      displayName: email.split('@')[0] || 'Merchant',
    });
    setAuthMode('demo');
    setAuthResolved(true);
    if (password.trim().length === 0) {
      throw new Error('Password required');
    }
    toast.success('Signed in using local demo session.');
    return { isDemo: true };
  };

  const signup = async (email: string, password: string, displayName: string) => {
    if (password.trim().length < 6) {
      throw new Error('Password too short');
    }
    setUser({
      uid: 'local-merchant-user',
      email,
      displayName,
    });
    setOnboarded(false);
    setAuthMode('demo');
    setAuthResolved(true);
    toast.success('Created local demo workspace.');
    return { isDemo: true };
  };

  const loginWithGoogle = async () => {
    setUser({
      uid: 'local-google-user',
      email: 'merchant@payassist.app',
      displayName: 'Ishan Merchant',
    });
    setAuthMode('demo');
    setAuthResolved(true);
    toast.success('Entered using local demo Google sign-in.');
    return { isDemo: true };
  };

  const logout = async () => {
    logoutStore();
  };

  return { login, signup, loginWithGoogle, logout, usingDemoMode: true };
}
