import { motion } from 'motion/react';
import { BorderReveal } from '../components/BorderReveal';

const SECURITY_FEATURES = [
  { icon: '🔒', title: 'DPDP 2023 Compliant', desc: 'Client-side redaction of PII. Data retained only for transaction lifecycle duration.' },
  { icon: '🔑', title: 'No Stored Credentials', desc: 'We never store your Paytm API keys. All secrets live in environment - never in our database.' },
  { icon: '🛡', title: 'Server-Side Checksums', desc: 'All Paytm API calls verified server-side. No checksum generation in client code - ever.' },
  { icon: '📋', title: 'RBI Framework Aligned', desc: 'Dispute timelines, refund SLAs, and escalation paths follow RBI outer limits - not guesses.' },
  { icon: '🔐', title: 'Webhook Idempotency', desc: 'Duplicate webhook deliveries are deduplicated. No double-counted payments.' },
  { icon: '⚖️', title: 'AI Disclaimer Layer', desc: 'AI explanations are clearly labeled. Settlement ETAs show ranges, not guaranteed times.' },
];

export function Security() {
  return (
    <section id="security" style={{ padding: '120px 0', background: 'var(--bg-base)' }}>
      <div className="container">
        <BorderReveal />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }} className="lg:grid lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="label" style={{ color: 'var(--cyan)' }}>TRUST BY DESIGN</span>
            <h2 className="display-lg" style={{ color: 'var(--navy)', marginTop: '12px' }}>
              Your merchants' data is<br />
              not our product.
            </h2>
            <p className="body-lg" style={{ color: 'var(--text-muted)', maxWidth: '440px', marginTop: '16px' }}>
              PayAssist is built with India's Digital Personal Data Protection Act in mind. We hold the minimum data needed, for the shortest time necessary, with the strictest controls.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }} className="sm:grid sm:grid-cols-2">
            {SECURITY_FEATURES.map((item, index) => (
              <motion.article key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ delay: index * 0.05 }} style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-sm)', borderRadius: '18px', padding: '18px', borderLeft: '3px solid #059669' }}>
                <div style={{ fontSize: '24px' }}>{item.icon}</div>
                <div style={{ color: 'var(--navy)', fontWeight: 700, marginTop: '12px' }}>{item.title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '8px' }}>{item.desc}</div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
