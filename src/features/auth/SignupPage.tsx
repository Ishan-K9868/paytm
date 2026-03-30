import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthLayout } from '@/features/auth/AuthLayout';
import { useAuth } from '@/hooks/useAuth';

export function SignupPage() {
  const navigate = useNavigate();
  const { signup, usingDemoMode } = useAuth();
  const [email, setEmail] = useState('newmerchant@payassist.app');
  const [businessName, setBusinessName] = useState('New Merchant');
  const [password, setPassword] = useState('merchant-demo');

  return (
    <AuthLayout
      eyebrow="New Workspace"
      subtitle={usingDemoMode ? 'This creates a fully routed demo workspace until Firebase project variables are connected.' : 'Create your merchant workspace and continue into onboarding.'}
      title="Create your PayAssist workspace"
    >
      <div className="auth-form-grid">
        <label>
          <span className="auth-label">Business name</span>
          <Input className="auth-input" onChange={(event) => setBusinessName(event.target.value)} value={businessName} />
        </label>
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
              await signup(email, password, businessName);
              navigate('/auth/onboarding');
            } catch {
              toast.error('Unable to create workspace right now.');
            }
          }}
          type="button"
        >
          {usingDemoMode ? 'Create demo workspace' : 'Create workspace'}
        </Button>
      </div>
    </AuthLayout>
  );
}
