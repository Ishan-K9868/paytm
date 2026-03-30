import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { FaBalanceScale, FaBrain, FaChartBar, FaChartLine, FaMicrophone, FaSearch } from 'react-icons/fa';
import { BorderReveal } from '../components/BorderReveal';

function MiniVerifier() {
  const [value, setValue] = useState('hello');
  const valid = /^PAY|^UPI|^ORD/i.test(value);

  return (
    <div style={{ background: 'var(--surface)', borderRadius: '14px', padding: '14px', border: '1px solid var(--border)' }}>
      <input value={value} onChange={(event) => setValue(event.target.value)} style={{ width: '100%', borderRadius: '10px', border: '1px solid var(--border)', padding: '10px 12px', fontFamily: 'var(--font-mono)', background: 'transparent', color: 'var(--text-body)' }} />
      <div style={{ marginTop: '12px', fontSize: '12px', color: valid ? '#15803D' : '#B45309', fontWeight: 700 }}>
        {valid ? 'Valid rail pattern detected' : 'Not a valid transaction ID - try PAY2024...'}
      </div>
    </div>
  );
}

function MiniBars() {
  const [bars, setBars] = useState([42, 65, 58, 80]);
  useEffect(() => {
    const timer = window.setInterval(() => setBars((current) => current.map((value) => Math.max(24, Math.min(92, value + (Math.random() > 0.5 ? 8 : -8))))), 3000);
    return () => window.clearInterval(timer);
  }, []);

  return <div style={{ display: 'flex', gap: '6px', height: '84px', alignItems: 'end' }}>{bars.map((bar, index) => <motion.div key={index} animate={{ height: `${bar}%` }} style={{ flex: 1, borderRadius: '6px 6px 2px 2px', background: index === 2 ? 'var(--amber)' : index % 2 ? 'var(--cyan)' : 'var(--navy)' }} />)}</div>;
}

function MiniHealthBoard() {
  const [score, setScore] = useState(85);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setScore((current) => (current >= 94 ? 85 : current + 3));
    }, 1800);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div style={{ display: 'grid', gap: '18px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '96px 1fr', gap: '14px', alignItems: 'center' }}>
        <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: `conic-gradient(#059669 0 ${score}%, rgba(5,150,105,0.14) ${score}% 100%)`, display: 'grid', placeItems: 'center' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--surface)', display: 'grid', placeItems: 'center', color: 'var(--navy)', fontWeight: 800, fontSize: '24px' }}>{score}</div>
        </div>
        <div style={{ display: 'grid', gap: '8px' }}>
          {[
            { label: 'Success rate', value: '98.2%' },
            { label: 'Dispute ratio', value: '0.3%' },
            { label: 'Settlement speed', value: 'T+1' },
            { label: 'Refund lag', value: '1.2 days' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
              <span style={{ color: 'var(--navy)', fontWeight: 700 }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderRadius: '14px', background: 'var(--surface)', border: '1px solid var(--border)', padding: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ color: 'var(--navy)', fontWeight: 700, fontSize: '13px' }}>Health trend - last 30 days</span>
          <span style={{ color: '#059669', fontSize: '12px', fontWeight: 700 }}>+6 this week</span>
        </div>
        <svg viewBox="0 0 240 72" style={{ width: '100%', height: '72px' }}>
          <path d="M6 56 C 32 48, 44 42, 60 44 S 96 56, 124 40 S 168 18, 194 26 S 220 28, 234 12" fill="none" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
          <path d="M6 62 H234" stroke="rgba(0,46,110,0.08)" strokeWidth="1" />
          <circle cx="234" cy="12" r="4" fill="#059669" />
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ borderRadius: '14px', background: 'var(--surface-soft)', border: '1px solid var(--border)', padding: '14px' }}>
          <div style={{ color: 'var(--navy)', fontWeight: 700, fontSize: '13px' }}>Rail mix</div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
            <div style={{ flex: 68, height: '10px', borderRadius: '999px', background: 'var(--cyan)' }} />
            <div style={{ flex: 22, height: '10px', borderRadius: '999px', background: 'var(--navy)' }} />
            <div style={{ flex: 10, height: '10px', borderRadius: '999px', background: 'var(--amber)' }} />
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>UPI 68%</span>
            <span>Card 22%</span>
            <span>Links 10%</span>
          </div>
        </div>

        <div style={{ borderRadius: '14px', background: 'var(--surface-warm)', border: '1px solid rgba(245,166,35,0.2)', padding: '14px' }}>
          <div style={{ color: 'var(--navy)', fontWeight: 700, fontSize: '13px' }}>PayAssist says</div>
          <p style={{ marginTop: '8px', fontSize: '12px', lineHeight: 1.6, color: 'var(--text-body)' }}>
            Card MDR is spiking on weekend traffic. Review routing before it starts eating into margin.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['Settlements healthy', 'Disputes low', 'Refund watch'].map((chip, index) => (
          <span key={chip} style={{ padding: '8px 10px', borderRadius: '999px', background: index === 2 ? 'rgba(245,166,35,0.14)' : 'rgba(0,185,241,0.1)', color: index === 2 ? '#B45309' : 'var(--navy)', fontSize: '11px', fontWeight: 700 }}>
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Features() {
  const cards = [
    {
      key: 'verifier',
      title: 'Payment Verified. In 10 seconds.',
      body: "No more calling customers back. No more 'let me check the app.' PayAssist pulls live status from Paytm rails and explains it in plain language.",
      accent: '#00B9F1',
      icon: <FaSearch />,
      span: 'lg:col-span-2 lg:row-span-2',
      visual: <MiniVerifier />,
    },
    {
      key: 'recon',
      title: 'Books close in 30 seconds',
      body: "AI matches your collected amounts against settlements. Flags every rupee that's off.",
      accent: '#0891B2',
      icon: <FaChartBar />,
      span: '',
      visual: <MiniBars />,
    },
    {
      key: 'router',
      title: 'Route smarter. Lose less.',
      body: 'Know which payment methods fail most for your merchant category. Optimize before losses compound.',
      accent: '#7C3AED',
      icon: <FaBrain />,
      span: '',
      visual: <div style={{ width: '92px', height: '92px', borderRadius: '50%', background: 'conic-gradient(var(--cyan) 0 68%, var(--navy) 68% 90%, var(--amber) 90% 100%)', margin: '0 auto' }} />,
    },
    {
      key: 'dispute',
      title: 'Dispute filed. In 2 clicks.',
      body: 'PayAssist drafts your dispute response using exact transaction facts. Tracks RBI deadlines. Reminds you before expiry. You just review and approve.',
      accent: '#DC2626',
      icon: <FaBalanceScale />,
      span: 'lg:col-span-2',
      visual: <motion.div initial={{ opacity: 0.4 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ background: 'var(--surface)', borderRadius: '14px', padding: '14px', border: '1px solid var(--border)', fontSize: '13px', lineHeight: 1.6 }}>Dear Dispute Team, the merchant confirms the customer completed the purchase and received delivery on the same day...</motion.div>,
    },
    {
      key: 'analytics',
      title: 'Your payment health score',
      body: 'Track success rates, dispute ratios, settlement velocity - and the one recommendation that matters most this week.',
      accent: '#059669',
      icon: <FaChartLine />,
      span: 'lg:row-span-2',
      visual: <MiniHealthBoard />,
    },
    {
      key: 'voice',
      title: 'Ask in Hindi. Get answers in seconds.',
      body: 'Voice-first interface for the shop floor. No typing. No navigation. Just speak - and PayAssist explains your payment situation in plain language.',
      accent: '#DB2777',
      icon: <FaMicrophone />,
      span: 'lg:col-span-2',
      visual: <div><div style={{ display: 'flex', gap: '4px', alignItems: 'end', height: '56px' }}>{[18, 30, 42, 24, 38, 22, 34].map((height, index) => <motion.div key={index} animate={{ height: [height, height + 12, height] }} transition={{ duration: 1.2, repeat: Infinity, delay: index * 0.08 }} style={{ width: '10px', borderRadius: '999px', background: index % 2 ? '#DB2777' : 'var(--cyan)' }} />)}</div><div style={{ marginTop: '12px', background: 'var(--surface)', padding: '10px 12px', borderRadius: '999px', display: 'inline-block', fontSize: '12px', border: '1px solid var(--border)' }}>Aaj ka settlement kyon kam hai?</div></div>,
    },
  ];

  return (
    <section id="features" style={{ padding: '120px 0', background: 'var(--bg-base)' }}>
      <div className="container">
        <BorderReveal />
        <span className="label" style={{ color: 'var(--cyan)' }}>WHY MERCHANTS STICK WITH IT</span>
        <h2 className="display-lg" style={{ color: 'var(--navy)', marginTop: '12px', maxWidth: '760px' }}>
          Built for the messy parts of payments.<br />
          <em style={{ color: 'var(--cyan)' }}>Not the pretty slides.</em>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginTop: '48px', gridAutoFlow: 'row dense' }} className="lg:grid lg:grid-cols-3">
          {cards.map((card, index) => (
            <motion.article key={card.key} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ delay: index * 0.06, duration: 0.6 }} className={card.span} style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '24px', borderLeft: `3px solid ${card.accent}`, boxShadow: 'var(--shadow-sm)', transition: 'transform 0.3s var(--ease-spring), box-shadow 0.3s ease', height: '100%' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${card.accent}18`, color: card.accent, fontSize: '18px', marginBottom: '18px' }}>{card.icon}</div>
              <div style={{ marginBottom: '20px' }}>{card.visual}</div>
              <h3 style={{ color: 'var(--navy)', fontSize: card.key === 'verifier' || card.key === 'dispute' ? '34px' : '24px', lineHeight: 1.08, fontFamily: 'var(--font-display)' }}>{card.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '12px' }}>{card.body}</p>
              <a href="https://business.paytm.com/docs/api/" target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '16px', color: 'var(--navy)', fontWeight: 700, textDecoration: 'none' }}>Learn more →</a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
