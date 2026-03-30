import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthLayout } from '@/features/auth/AuthLayout';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, usingDemoMode } = useAuth();
  const isOnboarded = useAuthStore((state) => state.isOnboarded);
  const [email, setEmail] = useState('merchant@payassist.app');
  const [password, setPassword] = useState('merchant-demo');

  return (
    <AuthLayout
      eyebrow="Merchant Access"
      subtitle={usingDemoMode ? 'Firebase is not configured yet, so this screen falls back to a full demo sign-in flow.' : 'Sign in with your merchant credentials to enter PayAssist.'}
      title="Sign in to PayAssist"
    >
      <div className="auth-form-grid">
        <label>
          <span className="auth-label">Email</span>
          <Input className="auth-input" onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
        </label>
        <label>
          <span className="auth-label">Password</span>
          <Input className="auth-input" onChange={(event) => setPassword(event.target.value)} type="password" value={password} />
        </label>
        <Button
          className="auth-submit"
          onClick={async () => {
            try {
              await login(email, password);
              navigate(isOnboarded ? '/app/dashboard' : '/auth/onboarding');
            } catch {
              toast.error('Unable to sign in right now.');
            }
          }}
          type="button"
        >
          {usingDemoMode ? 'Continue into merchant demo' : 'Sign in'}
        </Button>
        <Button
          onClick={async () => {
            try {
              await loginWithGoogle();
              navigate(isOnboarded ? '/app/dashboard' : '/auth/onboarding');
            } catch {
              toast.error('Google sign-in is unavailable right now.');
            }
          }}
          type="button"
          variant="secondary"
        >
          {usingDemoMode ? 'Use demo Google sign-in' : 'Continue with Google'}
        </Button>
      </div>
    </AuthLayout>
  );
}
