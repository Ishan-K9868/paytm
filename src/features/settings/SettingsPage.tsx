import { useEffect, useState } from 'react';
import { AlertTriangle, ShieldCheck, Volume2 } from 'lucide-react';
import { Button, Card, Input, Modal, Select } from '@/components/ui';
import { PageIntro } from '@/features/shared/PageIntro';
import { useDebounce } from '@/hooks/useDebounce';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useMerchantStore } from '@/store/useMerchantStore';
import { useVoiceStore } from '@/store/useVoiceStore';

interface CopilotConfigState {
  copilotLanguage: 'english' | 'hindi' | 'bengali' | 'telugu';
  procurementAutoLimit: number;
  fraudShieldMode: 'strict' | 'smart';
  allowAccountAggregator: boolean;
  allowSupplierPayments: boolean;
}

export function SettingsPage() {
  const profile = useMerchantStore((state) => state.profile);
  const setProfile = useMerchantStore((state) => state.setProfile);
  const [paymentFailed, setPaymentFailed] = useState(true);
  const [settlementComplete, setSettlementComplete] = useState(true);
  const language = useVoiceStore((state) => state.language);
  const speed = useVoiceStore((state) => state.speed);
  const setLanguage = useVoiceStore((state) => state.setLanguage);
  const setSpeed = useVoiceStore((state) => state.setSpeed);
  const [businessName, setBusinessName] = useState(profile?.businessName ?? '');
  const [city, setCity] = useState(profile?.city ?? '');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber ?? '');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [copilotConfig, setCopilotConfig] = useLocalStorage<CopilotConfigState>('payassist-copilot-config', {
    copilotLanguage: 'hindi',
    procurementAutoLimit: 5000,
    fraudShieldMode: 'smart',
    allowAccountAggregator: false,
    allowSupplierPayments: false,
  });
  const debouncedName = useDebounce(businessName, 500);
  const debouncedCity = useDebounce(city, 500);
  const debouncedPhone = useDebounce(phoneNumber, 500);

  useEffect(() => {
    if (!profile) return;
    const nextBusinessName = debouncedName.trim();
    const nextCity = debouncedCity.trim();
    const nextPhone = debouncedPhone.trim();

    if (
      profile.businessName === nextBusinessName &&
      profile.city === nextCity &&
      profile.phoneNumber === nextPhone
    ) {
      return;
    }

    setProfile({
      ...profile,
      businessName: nextBusinessName,
      city: nextCity,
      phoneNumber: nextPhone,
    });
  }, [debouncedCity, debouncedName, debouncedPhone, profile, setProfile]);

  return (
    <PageIntro label="Profile" subtitle="Business settings, credential visibility, notification preferences, and safe account controls live here." title="Settings">
      <div className="settings-page">
        <Card accent="cyan" className="settings-section">
          <div className="settings-section-header"><div className="settings-section-title">Business Profile</div><div className="settings-section-subtitle">Editable merchant details</div></div>
          <div className="settings-section-body auth-form-grid">
            <label><span className="auth-label">Business name</span><Input className="input" onChange={(event) => setBusinessName(event.target.value)} value={businessName} /></label>
            <label><span className="auth-label">City</span><Input className="input" onChange={(event) => setCity(event.target.value)} value={city} /></label>
            <label><span className="auth-label">Phone number</span><Input className="input" onChange={(event) => setPhoneNumber(event.target.value)} value={phoneNumber} /></label>
            <label><span className="auth-label">Merchant ID</span><Input className="input mono" value={profile?.merchantId ?? ''} readOnly /></label>
          </div>
        </Card>

        <Card accent="warning" className="settings-section">
          <div className="settings-section-header"><div className="settings-section-title">Paytm API Credentials</div><div className="settings-section-subtitle">Credentials stay masked on the client and are tested before use.</div></div>
          <div className="settings-section-body auth-form-grid">
            <label><span className="auth-label">Merchant Key</span><Input className="input" type="password" value="demo-key-placeholder" readOnly /></label>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Button type="button" variant="secondary">Reveal</Button>
              <Button type="button"><ShieldCheck size={14} /> Test connection</Button>
            </div>
          </div>
        </Card>

        <Card accent="navy" className="settings-section">
          <div className="settings-section-header"><div className="settings-section-title">Notification Preferences</div><div className="settings-section-subtitle">Choose what PayAssist should push into your workflow</div></div>
          <div className="settings-section-body">
            <div className="setting-row"><div><div className="setting-label">Payment failed alerts</div><div className="setting-desc">Immediate notification when a customer attempt fails.</div></div><button className={`toggle ${paymentFailed ? 'active' : ''}`} onClick={() => setPaymentFailed((value) => !value)} type="button"><span className="toggle-thumb" /></button></div>
            <div className="setting-row"><div><div className="setting-label">Settlement complete alerts</div><div className="setting-desc">Know when a settlement batch has landed.</div></div><button className={`toggle ${settlementComplete ? 'active' : ''}`} onClick={() => setSettlementComplete((value) => !value)} type="button"><span className="toggle-thumb" /></button></div>
          </div>
        </Card>

        <Card accent="cyan" className="settings-section">
          <div className="settings-section-header"><div className="settings-section-title">Language & Voice</div><div className="settings-section-subtitle">Choose how PayAssist should respond on the floor.</div></div>
          <div className="settings-section-body auth-form-grid">
            <label><span className="auth-label">Default response language</span><Select onChange={(event) => setLanguage(event.target.value as 'hi' | 'en' | 'auto')} value={language}><option value="auto">Auto-detect</option><option value="hi">Hindi</option><option value="en">English</option></Select></label>
            <label><span className="auth-label">Voice speed</span><Select onChange={(event) => setSpeed(Number(event.target.value) as 0.7 | 1 | 1.3)} value={String(speed)}><option value="0.7">Slow</option><option value="1">Normal</option><option value="1.3">Fast</option></Select></label>
            <div className="dashboard-row-meta"><Volume2 size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} /> Voice preferences are stored in local app state for now.</div>
          </div>
        </Card>

        <Card accent="navy" className="settings-section">
          <div className="settings-section-header"><div className="settings-section-title">Copilot Swarm Configuration</div><div className="settings-section-subtitle">Control autonomy boundaries for procurement, fraud alerts, and payment actions.</div></div>
          <div className="settings-section-body auth-form-grid">
            <label>
              <span className="auth-label">Primary copilot language</span>
              <Select
                value={copilotConfig.copilotLanguage}
                onChange={(event) => setCopilotConfig((current) => ({ ...current, copilotLanguage: event.target.value as CopilotConfigState['copilotLanguage'] }))}
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="bengali">Bengali</option>
                <option value="telugu">Telugu</option>
              </Select>
            </label>

            <label>
              <span className="auth-label">Swarm procurement auto-approval limit (Rs.)</span>
              <Input
                className="input"
                type="range"
                min={1000}
                max={25000}
                step={500}
                value={copilotConfig.procurementAutoLimit}
                onChange={(event) => setCopilotConfig((current) => ({ ...current, procurementAutoLimit: Number(event.target.value) }))}
              />
              <div className="dashboard-row-meta">Current limit: Rs. {copilotConfig.procurementAutoLimit.toLocaleString('en-IN')}</div>
            </label>

            <label>
              <span className="auth-label">Fraud Shield sensitivity</span>
              <Select
                value={copilotConfig.fraudShieldMode}
                onChange={(event) => setCopilotConfig((current) => ({ ...current, fraudShieldMode: event.target.value as CopilotConfigState['fraudShieldMode'] }))}
              >
                <option value="strict">Strict Mode</option>
                <option value="smart">Smart Mode</option>
              </Select>
            </label>

            <div className="setting-row">
              <div><div className="setting-label">Authorize Account Aggregator access</div><div className="setting-desc">Improves continuous underwriting and credit catalyst confidence.</div></div>
              <button className={`toggle ${copilotConfig.allowAccountAggregator ? 'active' : ''}`} onClick={() => setCopilotConfig((current) => ({ ...current, allowAccountAggregator: !current.allowAccountAggregator }))} type="button"><span className="toggle-thumb" /></button>
            </div>

            <div className="setting-row">
              <div><div className="setting-label">Allow supplier payment initiation</div><div className="setting-desc">Lets Voice-Negotiator execute approved supplier payouts directly.</div></div>
              <button className={`toggle ${copilotConfig.allowSupplierPayments ? 'active' : ''}`} onClick={() => setCopilotConfig((current) => ({ ...current, allowSupplierPayments: !current.allowSupplierPayments }))} type="button"><span className="toggle-thumb" /></button>
            </div>
          </div>
        </Card>

        <div className="danger-section">
          <div className="danger-header"><AlertTriangle size={14} /> Danger Zone</div>
          <div className="settings-section-body" style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <Button type="button" variant="danger">Disconnect Paytm account</Button>
            <Button onClick={() => setShowDeleteModal(true)} type="button" variant="danger">Delete account</Button>
          </div>
        </div>

        <Modal onClose={() => setShowDeleteModal(false)} open={showDeleteModal} title="Delete account">
          <div className="auth-form-grid">
            <p className="page-subtitle">Type DELETE to confirm this destructive action.</p>
            <Input className="input" onChange={(event) => setDeleteConfirm(event.target.value)} value={deleteConfirm} />
            <div className="auth-actions-row">
              <Button onClick={() => setShowDeleteModal(false)} type="button" variant="secondary">Cancel</Button>
              <Button disabled={deleteConfirm !== 'DELETE'} onClick={() => setShowDeleteModal(false)} type="button" variant="danger">Confirm delete</Button>
            </div>
          </div>
        </Modal>
      </div>
    </PageIntro>
  );
}
