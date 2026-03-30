import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { PageIntro } from '@/features/shared/PageIntro';
import { useMerchantStore } from '@/store/useMerchantStore';

export function SettingsPage() {
  const profile = useMerchantStore((state) => state.profile);
  const [paymentFailed, setPaymentFailed] = useState(true);
  const [settlementComplete, setSettlementComplete] = useState(true);

  return (
    <PageIntro label="Profile" subtitle="Business settings, credential visibility, notification preferences, and safe account controls live here." title="Settings">
      <div className="settings-page">
        <Card accent="cyan" className="settings-section">
          <div className="settings-section-header"><div className="settings-section-title">Business Profile</div><div className="settings-section-subtitle">Editable merchant details</div></div>
          <div className="settings-section-body auth-form-grid">
            <label><span className="auth-label">Business name</span><Input className="input" value={profile?.businessName ?? ''} readOnly /></label>
            <label><span className="auth-label">City</span><Input className="input" value={profile?.city ?? ''} readOnly /></label>
            <label><span className="auth-label">Merchant ID</span><Input className="input mono" value={profile?.merchantId ?? ''} readOnly /></label>
          </div>
        </Card>

        <Card accent="navy" className="settings-section">
          <div className="settings-section-header"><div className="settings-section-title">Notification Preferences</div><div className="settings-section-subtitle">Choose what PayAssist should push into your workflow</div></div>
          <div className="settings-section-body">
            <div className="setting-row"><div><div className="setting-label">Payment failed alerts</div><div className="setting-desc">Immediate notification when a customer attempt fails.</div></div><button className={`toggle ${paymentFailed ? 'active' : ''}`} onClick={() => setPaymentFailed((value) => !value)} type="button"><span className="toggle-thumb" /></button></div>
            <div className="setting-row"><div><div className="setting-label">Settlement complete alerts</div><div className="setting-desc">Know when a settlement batch has landed.</div></div><button className={`toggle ${settlementComplete ? 'active' : ''}`} onClick={() => setSettlementComplete((value) => !value)} type="button"><span className="toggle-thumb" /></button></div>
          </div>
        </Card>

        <div className="danger-section">
          <div className="danger-header"><AlertTriangle size={14} /> Danger Zone</div>
          <div className="settings-section-body" style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <Button type="button" variant="danger">Disconnect Paytm account</Button>
            <Button type="button" variant="danger">Delete account</Button>
          </div>
        </div>
      </div>
    </PageIntro>
  );
}
