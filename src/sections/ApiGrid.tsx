import { motion } from 'motion/react';
import { FaBalanceScale, FaBell, FaBrain, FaFileInvoice, FaLink, FaMicrophone, FaSearch, FaUndo } from 'react-icons/fa';
import { BorderReveal } from '../components/BorderReveal';

const APIS = [
  { name: 'Transaction Status API', icon: <FaSearch />, enables: 'Live payment verification', status: 'integrated', endpoint: 'POST /v3/order/status', code: 'await paytm.transactionStatus({ orderId, mid })' },
  { name: 'Webhook Callbacks', icon: <FaBell />, enables: 'Real-time payment events', status: 'integrated', endpoint: 'POST /merchant/callback', code: "paytm.on('payment.success', handler)" },
  { name: 'Refund API', icon: <FaUndo />, enables: 'Initiate & track refunds', status: 'integrated', endpoint: 'POST /v2/refund/apply', code: 'await paytm.refund.create({ txnId, amount })' },
  { name: 'Dispute & Chargeback API', icon: <FaBalanceScale />, enables: 'File and track disputes', status: 'integrated', endpoint: 'POST /merchant/dispute/submit', code: 'await paytm.dispute.file({ txnId, reason, docs })' },
  { name: 'Settlement Report API', icon: <FaFileInvoice />, enables: 'Daily reconciliation data', status: 'integrated', endpoint: 'GET /merchant/settlement/txnReport', code: 'await paytm.settlement.report({ date, mid })' },
  { name: 'Payment Links API', icon: <FaLink />, enables: 'Generate & share payment links', status: 'integrated', endpoint: 'POST /v3/link/create', code: 'await paytm.link.create({ amount, customer })' },
  { name: 'AI Router', icon: <FaBrain />, enables: 'Smart instrument selection', status: 'integrated', endpoint: 'Auto-routing via Paytm PG', code: '// AI Router auto-selects optimal rail' },
  { name: 'Voice (Web Speech + Gemini)', icon: <FaMicrophone />, enables: 'Hindi/English voice queries', status: 'integrated', endpoint: 'WebSpeech API + Gemini Pro', code: "await gemini.understand({ audio, locale: 'hi' })" },
];

export function ApiGrid() {
  return (
    <section id="apis" className="checkered checkered-sparse" style={{ padding: '120px 0' }}>
      <div className="container">
        <BorderReveal />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }} className="lg:grid lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="label" style={{ color: 'var(--cyan)' }}>BUILT ON REAL INFRASTRUCTURE</span>
            <h2 className="display-lg" style={{ color: 'var(--navy)', marginTop: '12px' }}>
              Not a wrapper.<br />
              Not a mockup.<br />
              <em style={{ color: 'var(--amber)' }}>Real Paytm APIs.</em>
            </h2>
            <p className="body-md" style={{ color: 'var(--text-muted)', marginTop: '16px', maxWidth: '360px' }}>
              PayAssist integrates directly with Paytm's production merchant stack. Every feature you see is powered by documented, production-grade Paytm infrastructure.
            </p>
            <a href="https://business.paytm.com/docs/api/" target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '18px', color: 'var(--navy)', fontWeight: 700, textDecoration: 'none' }}>View API docs ↗</a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }} className="sm:grid sm:grid-cols-2">
            {APIS.map((api, index) => (
              <motion.article key={api.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ delay: index * 0.05 }} style={{ minHeight: '160px', background: 'white', border: '1px solid var(--border)', borderRadius: '18px', padding: '18px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy)' }}>{api.icon}</div>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: api.status === 'integrated' ? '#16A34A' : 'var(--cyan)' }} />
                </div>
                <div style={{ color: 'var(--navy)', fontWeight: 700, marginTop: '16px' }}>{api.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px' }}>{api.enables}</div>
                <div style={{ color: 'var(--text-body)', fontSize: '12px', marginTop: '14px', fontFamily: 'var(--font-mono)' }}>{api.endpoint}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>{api.code}</div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
