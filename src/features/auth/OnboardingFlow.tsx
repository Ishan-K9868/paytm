import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { AuthLayout } from '@/features/auth/AuthLayout';
import { merchantIdSchema, onboardingStep1Schema } from '@/lib/validators';
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
  const [businessCategory, setBusinessCategory] = useState<'Retail' | 'Food & Beverage' | 'Services' | 'Healthcare' | 'Education' | 'Other'>('Retail');
  const [city, setCity] = useState('Noida');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [merchantId, setMerchantIdLocal] = useState('PAYAID001');
  const [merchantKey, setMerchantKey] = useState('demo-key-placeholder');
  const [websiteUrl, setWebsiteUrl] = useState('https://agarwal-shop.example');
  const [industryType, setIndustryType] = useState('Retail');
  const [connectionState, setConnectionState] = useState<'idle' | 'testing' | 'success' | 'failure'>('idle');

  const isLastStep = step === steps.length - 1;
  const connectionMessage = useMemo(() => {
    if (connectionState === 'testing') return 'Running Paytm connection test...';
    if (connectionState === 'success') return 'Connection verified. Merchant workspace is ready.';
    if (connectionState === 'failure') return 'Connection failed. Please verify Merchant ID and key.';
    return 'Use your merchant credentials to test the connection before entering PayAssist.';
  }, [connectionState]);

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
            <span className="auth-label">Business category</span>
            <Select onChange={(event) => setBusinessCategory(event.target.value as typeof businessCategory)} value={businessCategory}>
              <option>Retail</option>
              <option>Food & Beverage</option>
              <option>Services</option>
              <option>Healthcare</option>
              <option>Education</option>
              <option>Other</option>
            </Select>
          </label>
          <label>
            <span className="auth-label">City</span>
            <Input className="auth-input" onChange={(event) => setCity(event.target.value)} value={city} />
          </label>
          <label>
            <span className="auth-label">Phone number</span>
            <Input className="auth-input" onChange={(event) => setPhoneNumber(event.target.value)} value={phoneNumber} />
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
            <Input className="auth-input" onChange={(event) => setMerchantKey(event.target.value)} type="password" value={merchantKey} />
          </label>
          <label>
            <span className="auth-label">Website URL</span>
            <Input className="auth-input" onChange={(event) => setWebsiteUrl(event.target.value)} value={websiteUrl} />
          </label>
          <label>
            <span className="auth-label">Industry type</span>
            <Input className="auth-input" onChange={(event) => setIndustryType(event.target.value)} value={industryType} />
          </label>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="connection-test">
          <div className="section-label">Connection test</div>
          <h2 className="dashboard-panel-title">{connectionState === 'success' ? 'Credentials look good' : connectionState === 'failure' ? 'Connection failed' : 'Test your Paytm connection'}</h2>
          <p className="page-subtitle">{connectionMessage}</p>
          <div className="auth-actions-row" style={{ justifyContent: 'center' }}>
            <Button
              onClick={() => {
                setConnectionState('testing');
                window.setTimeout(() => {
                  setConnectionState(merchantId.startsWith('PAY') && merchantKey.length >= 8 ? 'success' : 'failure');
                }, 1200);
              }}
              type="button"
            >
              {connectionState === 'testing' ? 'Testing...' : 'Run connection test'}
            </Button>
          </div>
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
                  businessCategory,
                  city,
                  phoneNumber,
                });

                if (!validation.success) {
                  toast.error(validation.error.issues[0]?.message ?? 'Please complete your business profile.');
                  return;
                }
              }

              if (step === 1) {
                const mid = merchantIdSchema.safeParse(merchantId);
                if (!mid.success || merchantKey.trim().length < 8) {
                  toast.error('Enter a valid Merchant ID and Merchant Key.');
                  return;
                }
              }

              setStep((current) => current + 1);
              return;
            }

            if (connectionState !== 'success') {
              toast.error('Run a successful connection test before entering the workspace.');
              return;
            }

            setProfile({
              businessName,
              businessCategory,
              city,
              phoneNumber,
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
