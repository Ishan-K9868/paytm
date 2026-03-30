import { useMemo } from 'react';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/store/useAuthStore';

function isDemoFirebaseConfig() {
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  return !projectId || projectId === 'payassist-demo';
}

export function useAuth() {
  const setUser = useAuthStore((state) => state.setUser);
  const setOnboarded = useAuthStore((state) => state.setOnboarded);
  const loginDemo = useAuthStore((state) => state.loginDemo);
  const logoutStore = useAuthStore((state) => state.logout);

  const usingDemoMode = useMemo(() => isDemoFirebaseConfig(), []);

  const login = async (email: string, password: string) => {
    if (usingDemoMode) {
      loginDemo({ email, displayName: 'Ishan Merchant' });
      toast.success('Signed in using PayAssist demo mode.');
      return { isDemo: true };
    }

    const credential = await signInWithEmailAndPassword(auth, email, password);
    setUser({
      uid: credential.user.uid,
      email: credential.user.email ?? email,
      displayName: credential.user.displayName ?? 'Merchant',
    });
    return { isDemo: false };
  };

  const signup = async (email: string, password: string, displayName: string) => {
    if (usingDemoMode) {
      loginDemo({ email, displayName });
      setOnboarded(false);
      toast.success('Created demo workspace.');
      return { isDemo: true };
    }

    const credential = await createUserWithEmailAndPassword(auth, email, password);
    setUser({
      uid: credential.user.uid,
      email: credential.user.email ?? email,
      displayName,
    });
    setOnboarded(false);
    return { isDemo: false };
  };

  const loginWithGoogle = async () => {
    if (usingDemoMode) {
      loginDemo({ email: 'merchant@payassist.app', displayName: 'Ishan Merchant' });
      toast.success('Entered using demo Google sign-in.');
      return { isDemo: true };
    }

    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    setUser({
      uid: credential.user.uid,
      email: credential.user.email ?? 'merchant@payassist.app',
      displayName: credential.user.displayName ?? 'Merchant',
    });
    return { isDemo: false };
  };

  const logout = async () => {
    if (!usingDemoMode) {
      await signOut(auth);
    }
    logoutStore();
  };

  return { login, signup, loginWithGoogle, logout, usingDemoMode };
}
