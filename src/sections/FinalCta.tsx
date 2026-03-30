import { motion } from 'motion/react';

export function FinalCta() {
  return (
    <section id="cta" style={{ minHeight: '80vh', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 0', position: 'relative' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto', position: 'relative' }}>
          <motion.p className="label" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} style={{ color: 'var(--cyan)' }}>
            READY TO STOP GUESSING?
          </motion.p>
          <motion.h2 className="display-xl" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ color: 'white', marginTop: '16px' }}>
            Your payments, <em style={{ color: 'var(--cyan)' }}>finally clear.</em>
          </motion.h2>
          <motion.p className="body-lg" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ color: 'var(--text-on-dark-muted)', marginTop: '20px' }}>
            Join India's merchants who've stopped guessing about their payments. PayAssist runs on Paytm infrastructure - you already have everything you need.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '40px', flexWrap: 'wrap' }}>
            <a href="/auth/login" style={{ background: 'var(--cyan)', color: 'var(--navy)', padding: '18px 40px', borderRadius: 'var(--radius-pill)', fontSize: '17px', fontWeight: 800, border: 'none', cursor: 'pointer', boxShadow: 'var(--shadow-cyan)', letterSpacing: '-0.01em', textDecoration: 'none' }}>Try PayAssist free →</a>
            <a href="/app/dashboard" style={{ background: 'transparent', color: 'white', padding: '18px 40px', borderRadius: 'var(--radius-pill)', fontSize: '17px', fontWeight: 600, border: '2px solid rgba(255,255,255,0.2)', cursor: 'pointer', textDecoration: 'none' }}>Open dashboard</a>
          </motion.div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', marginTop: '24px' }}>Built on Paytm merchant stack · DPDP compliant · No card required</p>
        </div>
      </div>
    </section>
  );
}
