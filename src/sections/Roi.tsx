import { useEffect, useMemo, useState } from 'react';
import { useMotionValue, useMotionValueEvent, useSpring } from 'motion/react';
import { BorderReveal } from '../components/BorderReveal';

type Inputs = {
  daily_transactions: number;
  avg_transaction: number;
  dispute_rate: number;
  recon_minutes: number;
};

const DEFAULTS: Inputs = {
  daily_transactions: 50,
  avg_transaction: 800,
  dispute_rate: 1.2,
  recon_minutes: 45,
};

function computeROI(inputs: Inputs) {
  const { daily_transactions, avg_transaction, dispute_rate, recon_minutes } = inputs;
  const monthlyVolume = daily_transactions * avg_transaction * 30;
  const disputeLoss = monthlyVolume * (dispute_rate / 100) * 0.78;
  const reconTimeSaved = recon_minutes - 0.5;
  const reconValueSaved = (reconTimeSaved / 60) * 300 * 30;

  return {
    disputeRecovery: disputeLoss,
    timeSaved: reconTimeSaved * 30,
    moneyFromTime: reconValueSaved,
    totalROI: disputeLoss + reconValueSaved,
    paybackPeriod: 'Immediate (free plan available)',
  };
}

function SpringNumber({ value, format }: { value: number; format: (value: number) => string }) {
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { mass: 0.5, stiffness: 80, damping: 15 });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    mv.set(value);
  }, [mv, value]);

  useMotionValueEvent(spring, 'change', (latest) => setDisplay(latest));

  return <span className="tabular-nums">{format(display)}</span>;
}

export function Roi() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const outputs = useMemo(() => computeROI(inputs), [inputs]);

  const setValue = <K extends keyof Inputs>(key: K, value: number) => {
    setInputs((current) => ({ ...current, [key]: value }));
  };

  return (
    <section id="roi" className="checkered checkered-dense" style={{ minHeight: '100vh', padding: '120px 0' }}>
      <div className="container">
        <BorderReveal />
        <span className="label" style={{ color: 'var(--cyan)', display: 'block', textAlign: 'center' }}>ROI CALCULATOR</span>
        <h2 className="heading-xl" style={{ color: 'var(--navy)', textAlign: 'center', marginTop: '12px' }}>
          How much time (and money) are you losing right now?
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginTop: '34px' }} className="lg:grid lg:grid-cols-[0.9fr_1.1fr]">
          <div style={{ background: 'var(--surface)', borderRadius: '24px', border: '1px solid var(--border)', padding: '24px', boxShadow: 'var(--shadow-md)' }}>
            {[
              { id: 'daily_transactions', label: 'How many payment transactions per day?', min: 10, max: 500, step: 10, unit: 'transactions', value: inputs.daily_transactions },
              { id: 'avg_transaction', label: 'Average transaction amount?', min: 100, max: 5000, step: 100, unit: '₹', prefix: true, value: inputs.avg_transaction },
              { id: 'dispute_rate', label: 'Dispute / chargeback rate?', min: 0.1, max: 5, step: 0.1, unit: '%', value: inputs.dispute_rate },
              { id: 'recon_minutes', label: 'Minutes spent on daily reconciliation?', min: 15, max: 120, step: 5, unit: 'min/day', value: inputs.recon_minutes },
            ].map((slider) => (
              <label key={slider.id} style={{ display: 'block', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                  <span style={{ color: 'var(--navy)', fontWeight: 700 }}>{slider.label}</span>
                  <span className="tabular-nums" style={{ color: 'var(--cyan)', fontWeight: 700 }}>{slider.prefix ? '₹' : ''}{slider.value}{slider.unit === '%' ? '%' : slider.unit === 'transactions' || slider.unit === 'min/day' ? ` ${slider.unit}` : ''}</span>
                </div>
                <input type="range" min={slider.min} max={slider.max} step={slider.step} value={slider.value} onChange={(event) => setValue(slider.id as keyof Inputs, Number(event.target.value))} style={{ width: '100%', accentColor: '#002E6E' }} />
              </label>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '18px' }} className="sm:grid sm:grid-cols-2">
            <div style={{ background: 'var(--surface)', borderRadius: '22px', border: '1px solid var(--border)', padding: '22px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Recovered from disputes per month</div>
              <div style={{ color: 'var(--navy)', fontSize: '36px', fontFamily: 'var(--font-display)', marginTop: '10px' }}><SpringNumber value={outputs.disputeRecovery} format={(value) => `₹${Math.round(value).toLocaleString('en-IN')}`} /></div>
            </div>
            <div style={{ background: 'var(--surface)', borderRadius: '22px', border: '1px solid var(--border)', padding: '22px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Time saved on reconciliation per month</div>
              <div style={{ color: 'var(--navy)', fontSize: '36px', fontFamily: 'var(--font-display)', marginTop: '10px' }}><SpringNumber value={outputs.timeSaved} format={(value) => `${Math.round(value)} min`} /></div>
            </div>
            <div style={{ background: 'var(--surface)', borderRadius: '22px', border: '1px solid var(--border)', padding: '22px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Value of your time saved</div>
              <div style={{ color: 'var(--navy)', fontSize: '36px', fontFamily: 'var(--font-display)', marginTop: '10px' }}><SpringNumber value={outputs.moneyFromTime} format={(value) => `₹${Math.round(value).toLocaleString('en-IN')}`} /></div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FDE6B2 100%)', borderRadius: '22px', border: '1px solid #F5A623', padding: '22px', boxShadow: 'var(--shadow-amber)' }}>
              <div style={{ color: 'var(--navy)', fontSize: '13px', fontWeight: 700 }}>Total monthly ROI</div>
              <div style={{ color: 'var(--navy)', fontSize: '42px', fontFamily: 'var(--font-display)', marginTop: '10px' }}><SpringNumber value={outputs.totalROI} format={(value) => `₹${Math.round(value).toLocaleString('en-IN')}`} /></div>
              <div style={{ color: 'var(--navy)', fontSize: '13px', marginTop: '10px' }}>{outputs.paybackPeriod}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
