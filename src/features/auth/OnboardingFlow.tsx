import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthLayout } from '@/features/auth/AuthLayout';
import { onboardingStep1Schema } from '@/lib/validators';
import { useAuthStore } from '@/store/useAuthStore';
import { useMerchantStore } from '@/store/useMerchantStore';

const steps = ['Business profile', 'Paytm credentials', 'Connection test'];

export function OnboardingFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const setMerchantId = useAuthStore((state) => state.setMerchantId);
  const setOnboarded = useAuthStore((state) => state.setOnboarded);
  const setProfile = useMerchantStore((state) => state.setProfile);
  const [businessName, setBusinessName] = useState('Agarwal Home Needs');
  const [city, setCity] = useState('Noida');
  const [merchantId, setMerchantIdLocal] = useState('PAYAID001');

  const isLastStep = step === steps.length - 1;

  return (
    <AuthLayout
      eyebrow="Merchant Setup"
      subtitle="This is the first real onboarding route. It currently seeds demo merchant data, then hands off to the app shell."
      title="Connect your Paytm operations"
    >
      <div className="onboarding-steps">
        {steps.map((item, index) => (
          <span className={`step-dot ${index === step ? 'active' : ''} ${index < step ? 'done' : ''}`.trim()} key={item} />
        ))}
      </div>

      {step === 0 ? (
        <div className="auth-form-grid">
          <label>
            <span className="auth-label">Business name</span>
            <Input className="auth-input" onChange={(event) => setBusinessName(event.target.value)} value={businessName} />
          </label>
          <label>
            <span className="auth-label">City</span>
            <Input className="auth-input" onChange={(event) => setCity(event.target.value)} value={city} />
          </label>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="auth-form-grid">
          <label>
            <span className="auth-label">Merchant ID</span>
            <Input className="auth-input" onChange={(event) => setMerchantIdLocal(event.target.value.toUpperCase())} value={merchantId} />
          </label>
          <label>
            <span className="auth-label">Merchant Key</span>
            <Input className="auth-input" type="password" value="demo-key-placeholder" readOnly />
          </label>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="connection-test">
          <div className="section-label">Connection test</div>
          <h2 className="dashboard-panel-title">Demo credentials look good</h2>
          <p className="page-subtitle">The live Firebase + Paytm verification handshake comes next, but the onboarding route and shell transition are now functional.</p>
        </div>
      ) : null}

      <div className="auth-actions-row">
        <Button disabled={step === 0} onClick={() => setStep((current) => current - 1)} type="button" variant="secondary">
          Back
        </Button>
        <Button
          onClick={() => {
            if (!isLastStep) {
              if (step === 0) {
                const validation = onboardingStep1Schema.safeParse({
                  businessName,
                  businessCategory: 'Retail',
                  city,
                  phoneNumber: '9876543210',
                });

                if (!validation.success) {
                  toast.error(validation.error.issues[0]?.message ?? 'Please complete your business profile.');
                  return;
                }
              }
              setStep((current) => current + 1);
              return;
            }

            setProfile({
              businessName,
              businessCategory: 'Retail',
              city,
              phoneNumber: '9876543210',
              merchantId,
            });
            setMerchantId(merchantId);
            setOnboarded(true);
            toast.success('Merchant workspace is ready.');
            navigate('/app/dashboard');
          }}
          type="button"
        >
          {isLastStep ? 'Enter PayAssist workspace' : 'Continue'}
        </Button>
      </div>
    </AuthLayout>
  );
}
