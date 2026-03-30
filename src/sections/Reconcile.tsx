import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { BorderReveal } from '../components/BorderReveal';

const ANOMALIES = [
  { type: 'Missing Credit', desc: 'UPI payment of ₹450 collected on Mar 28 not found in settlement', action: 'Raise query →', color: '#DC2626', detail: 'PayAssist found no matching settlement line item and prepared the reference IDs needed for escalation.' },
  { type: 'MDR Discrepancy', desc: 'Card payment MDR deducted at 1.8% - expected 1.5%', action: 'Dispute charge →', color: '#D97706', detail: 'Merchant category and negotiated slab indicate lower MDR should apply on this transaction.' },
  { type: 'Refund Pending', desc: '₹1,200 refund initiated 3 days ago - not yet credited to customer', action: 'Check status →', color: '#0891B2', detail: 'Refund state is stuck between bank acknowledgement and customer credit confirmation.' },
];

export function Reconcile() {
  const [dividerX, setDividerX] = useState(50);
  const [expanded, setExpanded] = useState<string | null>(ANOMALIES[0].type);
  const ref = useRef<HTMLDivElement | null>(null);

  const updateDivider = (clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setDividerX(Math.max(10, Math.min(90, next)));
  };

  return (
    <section id="reconcile" className="checkered checkered-sparse checkered-fade" style={{ minHeight: '100vh', padding: '120px 0' }}>
      <div className="container">
        <BorderReveal />
        <span className="label" style={{ color: 'var(--cyan)', display: 'block', textAlign: 'center' }}>SMART RECONCILIATION</span>
        <h2 className="display-lg" style={{ color: 'var(--navy)', textAlign: 'center', marginTop: '12px' }}>
          Watch 45 minutes of work<br />
          <em style={{ color: 'var(--cyan)' }}>become 30 seconds.</em>
        </h2>

        <div
          ref={ref}
          onMouseMove={(event) => event.buttons === 1 && updateDivider(event.clientX)}
          onTouchMove={(event) => updateDivider(event.touches[0].clientX)}
          style={{ position: 'relative', marginTop: '40px', height: '520px', borderRadius: '28px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', background: 'white', cursor: 'ew-resize' }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, padding: '28px', clipPath: `inset(0 ${100 - dividerX}% 0 0)` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <div className="label" style={{ color: '#DC2626' }}>Before PayAssist</div>
                <div style={{ color: 'var(--navy)', fontSize: '22px', fontWeight: 700 }}>Still reconciling...</div>
              </div>
              <div className="tabular-nums" style={{ color: '#DC2626', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>39 min 15 sec</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
              {Array.from({ length: 16 }).map((_, index) => {
                const bad = index === 5 || index === 9 || index === 13;
                return <div key={index} style={{ borderRadius: '10px', background: bad ? 'rgba(220,38,38,0.08)' : 'var(--bg-card)', border: `1px solid ${bad ? 'rgba(220,38,38,0.24)' : 'var(--border)'}`, padding: '12px', height: '72px' }}><div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TXN-{1000 + index}</div><div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy)', marginTop: '8px' }}>{bad ? '₹4,3O0' : `₹${(index + 2) * 180}`}</div></div>;
              })}
            </div>
          </div>

          <div style={{ position: 'absolute', inset: 0, padding: '28px', clipPath: `inset(0 0 0 ${dividerX}%)` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <div className="label" style={{ color: 'var(--cyan)' }}>After PayAssist</div>
                <div style={{ color: 'var(--navy)', fontSize: '22px', fontWeight: 700 }}>Reconciliation complete ✓</div>
              </div>
              <div className="tabular-nums" style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>28 seconds</div>
            </div>
            <div style={{ background: 'var(--bg-card)', borderRadius: '18px', padding: '18px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {[
                  { label: 'Collected', value: '₹12,400' },
                  { label: 'Settled', value: '₹12,060' },
                  { label: 'Anomalies', value: '2 flagged' },
                ].map((item) => (
                  <div key={item.label} style={{ background: 'white', borderRadius: '14px', padding: '14px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.label}</div>
                    <div style={{ fontSize: '24px', color: 'var(--navy)', fontWeight: 800, marginTop: '8px' }}>{item.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ height: '10px', marginTop: '18px', borderRadius: '999px', background: 'rgba(0,46,110,0.08)', overflow: 'hidden' }}>
                <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 3 }} style={{ transformOrigin: 'left', height: '100%', background: 'linear-gradient(90deg, var(--cyan), var(--navy))' }} />
              </div>
            </div>
          </div>

          <div
            onMouseDown={(event) => updateDivider(event.clientX)}
            onTouchStart={(event) => updateDivider(event.touches[0].clientX)}
            style={{ position: 'absolute', top: 0, bottom: 0, left: `${dividerX}%`, width: '2px', background: 'white', boxShadow: '0 0 0 1px rgba(0,46,110,0.18)', transform: 'translateX(-50%)' }}
          >
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '54px', height: '54px', borderRadius: '999px', background: 'white', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy)', fontWeight: 700 }}>↔</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px', marginTop: '24px' }} className="lg:grid lg:grid-cols-3">
          {ANOMALIES.map((anomaly) => (
            <button key={anomaly.type} onClick={() => setExpanded(expanded === anomaly.type ? null : anomaly.type)} style={{ textAlign: 'left', background: 'white', border: '1px solid var(--border)', borderLeft: `3px solid ${anomaly.color}`, borderRadius: '18px', padding: '16px', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: anomaly.color }} /><span style={{ color: 'var(--navy)', fontWeight: 700 }}>{anomaly.type}</span></div>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '8px' }}>{anomaly.desc}</div>
              {expanded === anomaly.type && <div style={{ color: 'var(--text-body)', fontSize: '13px', marginTop: '10px' }}>{anomaly.detail}</div>}
              <div style={{ color: anomaly.color, fontSize: '12px', fontWeight: 700, marginTop: '12px' }}>{anomaly.action}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
