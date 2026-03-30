import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BorderReveal } from '../components/BorderReveal';

type DemoState = 'idle' | 'loading' | 'verified' | 'anomaly' | 'failed';
type Scenario = 'verify' | 'close' | 'dispute';

const SAMPLE_IDS = ['PAY2024032991234', 'UPI/240329/123456789', 'ORD-KR-20240329-0044'];

function AnimatedCount({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    let start: number | null = null;
    const duration = 800;

    const tick = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  return <span className="tabular-nums">{prefix}{display.toLocaleString('en-IN')}{suffix}</span>;
}

function TypedParagraph({ text }: { text: string }) {
  const [typed, setTyped] = useState('');

  useEffect(() => {
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTyped(text.slice(0, index));
      if (index >= text.length) window.clearInterval(timer);
    }, 8);
    return () => window.clearInterval(timer);
  }, [text]);

  return <>{typed}</>;
}

export function LiveDemo() {
  const [query, setQuery] = useState('');
  const [demoState, setDemoState] = useState<DemoState>('idle');
  const [scenario, setScenario] = useState<Scenario>('verify');
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    setTypedText(query);
  }, [query]);

  const resultType = useMemo<DemoState>(() => {
    if (scenario === 'close') return 'anomaly';
    if (scenario === 'dispute') return 'failed';
    if (!query.trim()) return 'idle';
    return query.toLowerCase().includes('err') ? 'failed' : 'verified';
  }, [query, scenario]);

  const typeSample = (sample: string) => {
    setQuery('');
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      const next = sample.slice(0, index);
      setQuery(next);
      if (index >= sample.length) window.clearInterval(timer);
    }, 15);
  };

  const runDemo = () => {
    setDemoState('loading');
    window.setTimeout(() => setDemoState(resultType), 1600);
  };

  return (
    <section id="live-demo" className="checkered checkered-dense checkered-fade" style={{ minHeight: '100vh', padding: '120px 0', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <BorderReveal />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }} className="lg:grid lg:grid-cols-[1fr_1fr]">
          <div>
            <span className="label" style={{ color: 'var(--cyan)' }}>TRY IT RIGHT NOW</span>
            <h2 className="display-lg" style={{ color: 'var(--navy)', marginTop: '12px' }}>
              Paste any order ID.<br />
              Watch PayAssist verify it<br />
              <em style={{ color: 'var(--cyan)' }}>in real time.</em>
            </h2>

            <div style={{ marginTop: '32px', background: '#001A42', color: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F87171' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FBBF24' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#34D399' }} />
                </div>
                <div style={{ fontSize: '12px', color: '#8BA0CC', fontFamily: 'var(--font-mono)' }}>payassist terminal</div>
              </div>
              <div style={{ padding: '24px' }}>
                <p style={{ color: '#8BA0CC', fontSize: '13px' }}>&gt; enter transaction ID or order number to verify payment status</p>
                <div style={{ marginTop: '18px', color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>$ <span>{typedText}</span><span style={{ animation: 'blink 1s infinite' }}>|</span></div>
                <input
                  aria-label="Transaction ID"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && runDemo()}
                  placeholder="Type or paste transaction ID"
                  style={{ width: '100%', marginTop: '18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', padding: '14px 16px', borderRadius: '12px', fontFamily: 'var(--font-mono)' }}
                />
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
                  <button onClick={() => typeSample(SAMPLE_IDS[Math.floor(Math.random() * SAMPLE_IDS.length)])} style={{ borderRadius: '999px', border: '1px solid rgba(0,185,241,0.35)', background: 'rgba(0,185,241,0.12)', color: 'white', padding: '12px 18px', cursor: 'pointer' }}>TRY A SAMPLE</button>
                  <button onClick={runDemo} style={{ borderRadius: '999px', border: 'none', background: 'var(--cyan)', color: 'var(--navy)', padding: '12px 18px', fontWeight: 700, cursor: 'pointer' }}>VERIFY →</button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '18px' }}>
              {[
                { key: 'verify', icon: '🔍', label: 'Verify Payment' },
                { key: 'close', icon: '📊', label: 'Close Day' },
                { key: 'dispute', icon: '⚖️', label: 'File Dispute' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setScenario(tab.key as Scenario)}
                  style={{ borderRadius: '999px', border: scenario === tab.key ? '1px solid var(--cyan)' : '1px solid var(--border)', background: scenario === tab.key ? 'var(--cyan-08)' : 'var(--surface)', color: 'var(--navy)', padding: '10px 14px', cursor: 'pointer', fontWeight: 600 }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px', padding: '28px', boxShadow: 'var(--shadow-md)', minHeight: '520px' }}>
            <AnimatePresence mode="wait">
              {demoState === 'idle' && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Waiting for query... Paste a transaction ID or choose a scenario below.
                </motion.div>
              )}

              {demoState === 'loading' && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ paddingTop: '80px' }}>
                  <div aria-live="polite" style={{ color: 'var(--navy)', fontWeight: 700, marginBottom: '18px' }}>Scanning Paytm rails...</div>
                  {[0, 1, 2].map((bar) => (
                    <motion.div key={bar} animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1.2, repeat: Infinity, delay: bar * 0.15 }} style={{ height: '10px', borderRadius: '999px', background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)', marginBottom: '12px' }} />
                  ))}
                </motion.div>
              )}

              {demoState === 'verified' && (
                <motion.div key="verified" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
                  <div style={{ background: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: '12px', padding: '16px 20px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: 28, height: 28, background: '#16A34A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14 }}>✓</div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#15803D', fontSize: 15 }}>Payment Verified</div>
                        <div style={{ fontSize: 12, color: '#166534' }}>Transaction confirmed on Paytm rails</div>
                      </div>
                    </div>
                  </div>
                  {[
                    { label: 'Amount', value: '₹1,200.00', highlight: true },
                    { label: 'Status', value: 'SUCCESS' },
                    { label: 'Method', value: 'UPI — PhonePe' },
                    { label: 'Transaction ID', value: 'UPI240329123456789', mono: true },
                    { label: 'Settlement ETA', value: 'Tomorrow, 5:00 PM' },
                    { label: 'MDR Applied', value: '₹0.00 (UPI — zero MDR)' },
                  ].map((field, index) => (
                    <motion.div key={field.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 + 0.2 }} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                      <span className="body-sm" style={{ color: 'var(--text-muted)' }}>{field.label}</span>
                      <span style={{ fontFamily: field.mono ? 'var(--font-mono)' : 'var(--font-body)', fontWeight: field.highlight ? 700 : 500, fontSize: field.mono ? 12 : 14, color: field.highlight ? 'var(--navy)' : 'var(--text-body)' }}>{field.value}</span>
                    </motion.div>
                  ))}
                  <div style={{ background: 'var(--cyan-08)', borderRadius: 10, padding: '12px 16px', marginTop: 16, border: '1px solid var(--cyan-20)' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>AI COPILOT SAYS</span>
                    <p className="body-sm" style={{ color: 'var(--text-body)', marginTop: 6 }}>
                      This payment has fully settled. Your customer paid ₹1,200 via UPI at 3:19 PM. The amount will appear in your settlement report by tomorrow 5 PM. No action needed.
                    </p>
                  </div>
                </motion.div>
              )}

              {demoState === 'anomaly' && (
                <motion.div key="anomaly" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '12px', padding: '16px 20px', marginBottom: '16px' }}>
                    <div style={{ fontWeight: 700, color: '#92400E' }}>2 anomalies flagged while closing day</div>
                    <div style={{ fontSize: '13px', color: '#B45309', marginTop: '4px' }}>Collected: ₹12,400 · Settled: ₹12,060</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px', marginBottom: '16px' }}>
                    {[
                      { label: 'Matched', value: <><AnimatedCount value={46} /> / 48</>, tone: 'var(--navy)' },
                      { label: 'Recovered', value: <AnimatedCount value={12060} prefix="₹" />, tone: 'var(--cyan)' },
                      { label: 'Time to close', value: <AnimatedCount value={28} suffix=" sec" />, tone: 'var(--amber)' },
                    ].map((card) => (
                      <div key={card.label} style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '14px', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{card.label}</div>
                        <div className="tabular-nums" style={{ marginTop: '8px', color: card.tone, fontSize: '22px', fontWeight: 800 }}>{card.value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '16px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--navy)' }}>AI reconciliation progress</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>PayAssist matched collected rows with settlement lines and isolated the exact mismatch causes.</div>
                      </div>
                      <div className="tabular-nums" style={{ color: 'var(--cyan)', fontWeight: 800 }}><AnimatedCount value={96} suffix="%" /></div>
                    </div>
                    <div style={{ height: '10px', borderRadius: '999px', background: 'rgba(0,46,110,0.08)', marginTop: '14px', overflow: 'hidden' }}>
                      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 0.96 }} transition={{ duration: 0.8 }} style={{ height: '100%', transformOrigin: 'left', background: 'linear-gradient(90deg, var(--cyan), var(--navy))' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '14px' }}>
                    <div>
                      {[
                        { item: 'UPI reversal of ₹200', detail: 'Customer reversal accepted at 5:42 PM. No merchant action needed.', color: '#D97706' },
                        { item: 'MDR deduction mismatch of ₹140', detail: 'Charge exceeds expected card slab. Ready to dispute with reference IDs attached.', color: '#DC2626' },
                      ].map((item) => (
                        <div key={item.item} style={{ borderRadius: '12px', border: '1px solid var(--border)', padding: '14px 16px', marginBottom: '12px', borderLeft: `3px solid ${item.color}` }}>
                          <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{item.item}</div>
                          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{item.detail}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ borderRadius: '14px', background: 'var(--surface-soft)', border: '1px solid var(--border)', padding: '16px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--navy)' }}>Next best actions</div>
                      <div style={{ display: 'grid', gap: '10px', marginTop: '12px' }}>
                        {[
                          'Send reconciled PDF to accountant',
                          'Dispute MDR mismatch with attached references',
                          'Mark reversal as resolved in daily close',
                        ].map((step, index) => (
                          <div key={step} style={{ display: 'flex', gap: '10px', alignItems: 'start' }}>
                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--cyan-08)', color: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>{index + 1}</div>
                            <div style={{ fontSize: '13px', color: 'var(--text-body)' }}>{step}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '14px', marginTop: '14px' }}>
                    <div style={{ borderRadius: '14px', border: '1px solid var(--border)', padding: '16px', background: 'var(--surface)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--navy)' }}>Settlement match table</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Today</div>
                      </div>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {[
                          ['UPI sales', '₹8,240', '₹8,040'],
                          ['Card sales', '₹2,620', '₹2,480'],
                          ['Payment links', '₹1,540', '₹1,540'],
                          ['Refund reversals', '₹0', '₹200'],
                        ].map((row) => (
                          <div key={row[0]} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.8fr', gap: '8px', fontSize: '12px', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                            <span style={{ color: 'var(--text-muted)' }}>{row[0]}</span>
                            <span style={{ color: 'var(--navy)', fontWeight: 700 }}>{row[1]}</span>
                            <span style={{ color: row[1] === row[2] ? '#15803D' : '#B45309', fontWeight: 700 }}>{row[2]}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ borderRadius: '14px', border: '1px solid var(--border)', padding: '16px', background: 'var(--surface-soft)' }}>
                      <div style={{ fontWeight: 700, color: 'var(--navy)' }}>7-day settlement trend</div>
                      <div style={{ display: 'flex', alignItems: 'end', gap: '6px', height: '96px', marginTop: '14px' }}>
                        {[68, 74, 64, 80, 72, 58, 76].map((bar, index) => (
                          <motion.div key={index} initial={{ height: 0 }} animate={{ height: `${bar}%` }} transition={{ delay: index * 0.05, duration: 0.45 }} style={{ flex: 1, borderRadius: '8px 8px 3px 3px', background: index === 5 ? 'var(--amber)' : index === 6 ? 'var(--cyan)' : 'rgba(0,46,110,0.18)' }} />
                        ))}
                      </div>
                      <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        Today closes faster than the weekly average because PayAssist already grouped two anomalies before export.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
                    <button style={{ borderRadius: '999px', border: 'none', background: 'var(--navy)', color: 'white', padding: '12px 18px', cursor: 'pointer' }}>Export reconciled report</button>
                    <button style={{ borderRadius: '999px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--navy)', padding: '12px 18px', cursor: 'pointer' }}>Raise MDR dispute</button>
                  </div>
                </motion.div>
              )}

              {demoState === 'failed' && (
                <motion.div key="failed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '12px', padding: '16px 20px', marginBottom: '16px' }}>
                    <div style={{ fontWeight: 700, color: '#B91C1C' }}>{scenario === 'dispute' ? 'Dispute response drafted' : 'Payment needs attention'}</div>
                    <div style={{ fontSize: '13px', color: '#991B1B', marginTop: '4px' }}>{scenario === 'dispute' ? 'RBI timer tracked. Merchant guidance attached.' : 'Transaction could not be fully verified. Escalation route ready.'}</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px', marginBottom: '14px' }}>
                    {(scenario === 'dispute'
                      ? [
                          { label: 'Deadline left', value: <AnimatedCount value={13} suffix=" hrs" />, tone: '#B91C1C' },
                          { label: 'Evidence attached', value: <AnimatedCount value={4} suffix=" docs" />, tone: 'var(--cyan)' },
                          { label: 'Draft confidence', value: <AnimatedCount value={92} suffix="%" />, tone: 'var(--amber)' },
                        ]
                      : [
                          { label: 'Escalation path', value: 'Ready', tone: '#B91C1C' },
                          { label: 'Merchant risk', value: 'Medium', tone: 'var(--amber)' },
                          { label: 'Status checks', value: '3 run', tone: 'var(--cyan)' },
                        ]).map((card) => (
                      <div key={card.label} style={{ background: scenario === 'dispute' ? 'var(--surface-warm)' : 'var(--surface-soft)', borderRadius: '12px', padding: '14px', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{card.label}</div>
                        <div className="tabular-nums" style={{ marginTop: '8px', color: card.tone, fontSize: '22px', fontWeight: 800 }}>{card.value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderRadius: '14px', background: 'var(--surface-warm)', border: '1px solid rgba(245,166,35,0.24)', padding: '18px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>draft_response.txt</div>
                      <div style={{ fontSize: '12px', color: 'var(--amber)', fontWeight: 700 }}>Generated in 4.2s</div>
                    </div>
                    <div style={{ height: '8px', borderRadius: '999px', background: 'rgba(245,166,35,0.12)', overflow: 'hidden', marginTop: '12px' }}>
                      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.1 }} style={{ height: '100%', transformOrigin: 'left', background: 'linear-gradient(90deg, var(--amber), #FDBA74)' }} />
                    </div>
                    <p style={{ marginTop: '10px', fontSize: '14px', color: 'var(--text-body)' }}>
                      <TypedParagraph key={scenario} text="We confirm the merchant delivered the order and the customer completed the transaction using the registered device. Attached are the invoice, delivery confirmation, and device acknowledgement logs." />
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
                      {['Invoice.pdf', 'Delivery proof', 'Device logs', 'Customer acknowledgement'].map((doc) => (
                        <span key={doc} style={{ padding: '8px 10px', borderRadius: '999px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,46,110,0.08)', fontSize: '12px', color: 'var(--navy)', fontWeight: 600 }}>
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div style={{ borderRadius: '14px', border: '1px solid var(--border)', padding: '16px', background: 'var(--surface)' }}>
                      <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{scenario === 'dispute' ? 'RBI timer + filing status' : 'Escalation checklist'}</div>
                      <div style={{ display: 'grid', gap: '10px', marginTop: '12px' }}>
                        {(scenario === 'dispute'
                          ? ['Chargeback opened · completed', 'Evidence matched · completed', 'Merchant draft review · pending', 'Submit before 11:59 PM · urgent']
                          : ['Retry status API with MID', 'Check callback signature', 'Escalate to support with transaction ref', 'Notify merchant with safe next step'])
                          .map((item, index) => (
                            <div key={item} style={{ display: 'flex', gap: '10px', alignItems: 'start' }}>
                              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: index < 2 ? 'rgba(22,163,74,0.12)' : 'rgba(185,28,28,0.1)', color: index < 2 ? '#15803D' : '#B91C1C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>{index < 2 ? '✓' : '!'}</div>
                              <div style={{ fontSize: '13px', color: 'var(--text-body)' }}>{item}</div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div style={{ borderRadius: '14px', border: '1px solid var(--border)', padding: '16px', background: 'var(--surface-soft)' }}>
                      <div style={{ fontWeight: 700, color: 'var(--navy)' }}>Merchant-ready explanation</div>
                      <p style={{ marginTop: '10px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                        {scenario === 'dispute'
                          ? 'PayAssist has drafted the response using verified transaction facts, added the supporting documents, and highlighted the exact submission deadline so the merchant only needs to review and approve.'
                          : 'PayAssist could not fully verify the payment yet, but it already grouped the safest next checks and prepared the escalation packet so the merchant does not have to guess.'}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '14px', marginTop: '14px' }}>
                    <div style={{ borderRadius: '14px', border: '1px solid var(--border)', padding: '16px', background: 'var(--surface)' }}>
                      <div style={{ fontWeight: 700, color: 'var(--navy)' }}>Evidence confidence breakdown</div>
                      <div style={{ display: 'grid', gap: '10px', marginTop: '12px' }}>
                        {[
                          { label: 'Invoice match', value: 100, color: '#059669' },
                          { label: 'Device acknowledgement', value: 94, color: 'var(--cyan)' },
                          { label: 'Delivery confirmation', value: 88, color: 'var(--amber)' },
                        ].map((item) => (
                          <div key={item.label}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                              <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                              <span className="tabular-nums" style={{ color: 'var(--navy)', fontWeight: 700 }}><AnimatedCount value={item.value} suffix="%" /></span>
                            </div>
                            <div style={{ height: '8px', borderRadius: '999px', background: 'rgba(0,46,110,0.08)', overflow: 'hidden' }}>
                              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: item.value / 100 }} transition={{ duration: 0.8 }} style={{ height: '100%', transformOrigin: 'left', background: item.color }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ borderRadius: '14px', border: '1px solid rgba(245,166,35,0.24)', padding: '16px', background: 'var(--surface-warm)' }}>
                      <div style={{ fontWeight: 700, color: 'var(--navy)' }}>Submission timeline</div>
                      <div style={{ display: 'grid', gap: '12px', marginTop: '12px' }}>
                        {['Draft generated', 'Evidence attached', 'Merchant review pending', 'File before 11:59 PM'].map((step, index) => (
                          <div key={step} style={{ display: 'flex', gap: '10px', alignItems: 'start' }}>
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: index < 2 ? 'rgba(22,163,74,0.12)' : 'rgba(245,166,35,0.16)', color: index < 2 ? '#15803D' : '#B45309', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: 700 }}>{index < 2 ? '✓' : index + 1}</div>
                            <div style={{ fontSize: '13px', color: 'var(--text-body)' }}>{step}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '14px' }}>
                    <button style={{ borderRadius: '999px', border: 'none', background: 'var(--navy)', color: 'white', padding: '12px 18px', cursor: 'pointer' }}>{scenario === 'dispute' ? 'Submit dispute draft' : 'Escalate transaction'}</button>
                    <button style={{ borderRadius: '999px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--navy)', padding: '12px 18px', cursor: 'pointer' }}>Download evidence pack</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
