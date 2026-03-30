import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { BorderReveal } from '../components/BorderReveal';

const STEPS = [
  {
    icon: '📡',
    title: 'Event Captured',
    subtitle: 'Payment webhook · QR scan · Refund trigger',
    detail: 'Every payment event from Paytm - UPI callbacks, POS taps, payment link completions - hits our event bus in under 50ms.',
    color: '#00B9F1',
    code: `// Webhook received from Paytm\n{\n  "event": "TRANSACTION_SUCCESS",\n  "orderId": "ORD-2024-0044",\n  "txnAmount": "1200.00",\n  "bankTxnId": "UPI240329123456789",\n  "status": "TXN_SUCCESS"\n}`,
  },
  {
    icon: '⚙️',
    title: 'State Machine Runs',
    subtitle: 'Deterministic · API-verified · Zero hallucination',
    detail: 'A rules engine verifies the exact state of every transaction against Paytm live APIs. AI never guesses - it only explains what the machine already knows.',
    color: '#F5A623',
    code: `const txnState = await paytmClient\n  .transactionStatus\n  .verify({ orderId, txnAmount });\n\n// Returns: { confirmed: true, settlementDate: '2024-03-30' }`,
  },
  {
    icon: '🧠',
    title: 'Gemini Explains It',
    subtitle: 'Plain language · Hindi/English · Action-first',
    detail: 'The AI layer takes verified facts and turns them into clear merchant language. Your ₹540 is processing - expect settlement by 5 PM tomorrow.',
    color: '#7C3AED',
    code: `const explanation = await gemini.explain({\n  context: txnState,\n  language: 'hi',\n  merchantType: 'retail',\n});\n// "Aapka ₹1,200 ka payment..."`,
  },
  {
    icon: '✅',
    title: 'Merchant Acts',
    subtitle: 'Dashboard · Voice · WhatsApp alert',
    detail: 'The right action, at the right time, in the right channel. Tap to file dispute. Tap to export books. Tap to send payment link. Done.',
    color: '#059669',
    code: `await payassist.notify({\n  channel: 'voice' | 'dashboard' | 'whatsapp',\n  message: explanation,\n  actions: ['view_details', 'export', 'dispute'],\n});`,
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLElement | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const index = Math.min(STEPS.length - 1, Math.floor(latest * STEPS.length));
    setActiveStep(index);
  });

  return (
    <section id="how-it-works" ref={ref} className="checkered-navy" style={{ padding: '120px 0', minHeight: '150vh', position: 'relative' }}>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <BorderReveal dark />
        <span className="label" style={{ color: 'var(--cyan)' }}>UNDER THE HOOD</span>
        <h2 className="display-lg" style={{ color: 'white', marginTop: '12px', maxWidth: '760px' }}>
          Every payment event.<br />
          Explained. Actioned.<br />
          <em style={{ color: 'var(--amber)' }}>Automatically.</em>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px', marginTop: '56px' }} className="lg:grid lg:grid-cols-[1.1fr_0.9fr]">
          <div style={{ position: 'relative', paddingLeft: '20px' }}>
            <svg viewBox="0 0 40 760" style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '40px' }} aria-hidden="true">
              <motion.path d="M20 10 L20 740" stroke="var(--cyan)" strokeWidth="2" fill="none" style={{ pathLength }} />
            </svg>
            {STEPS.map((step, index) => (
              <motion.div key={step.title} initial={{ opacity: 0.4, x: 0 }} animate={{ opacity: activeStep >= index ? 1 : 0.42, x: activeStep === index ? 6 : 0 }} transition={{ duration: 0.25 }} style={{ position: 'relative', marginBottom: '48px', paddingLeft: '36px' }}>
                <div style={{ position: 'absolute', left: '-2px', top: '8px', width: '18px', height: '18px', borderRadius: '50%', background: step.color, boxShadow: `0 0 0 8px ${step.color}20` }} />
                <div style={{ color: step.color, fontSize: '26px' }}>{step.icon}</div>
                <h3 style={{ color: 'white', fontSize: '28px', marginTop: '10px', fontFamily: 'var(--font-display)' }}>{step.title}</h3>
                <div style={{ color: step.color, fontSize: '13px', fontWeight: 700, marginTop: '8px' }}>{step.subtitle}</div>
                <p style={{ color: 'var(--text-on-dark-muted)', fontSize: '15px', marginTop: '10px', maxWidth: '520px' }}>{step.detail}</p>
              </motion.div>
            ))}
          </div>

          <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
            <motion.div key={activeStep} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ background: 'rgba(0, 0, 0, 0.18)', border: '1px solid rgba(0,185,241,0.12)', borderRadius: '24px', padding: '24px', boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ color: 'var(--cyan)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Live infra snapshot</div>
              <pre style={{ marginTop: '16px', color: '#E8F0FF', fontSize: '13px', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)' }}>{STEPS[activeStep].code}</pre>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
