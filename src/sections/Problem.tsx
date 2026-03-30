import { motion } from 'motion/react';
import { BorderReveal } from '../components/BorderReveal';

const PROBLEMS = [
  {
    title: "The soundbox didn't beep.",
    body:
      "Customer walked away. Did it go through? You call them. Check the app. Refresh three times. You're still not sure. Meanwhile, the next customer is waiting.",
    stat: '10 minutes of anxiety · per incident',
    color: '#DC2626',
    visual: (
      <div style={{ height: '200px', position: 'relative', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: '18px', top: '18px', width: '92px', height: '160px', borderRadius: '18px', border: '2px solid rgba(255,255,255,0.18)' }} />
        <motion.div
          animate={{ opacity: [0, 1, 1, 0], y: [18, 0, 0, -14] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          style={{ position: 'absolute', left: '34px', top: '48px', right: '28px', background: 'rgba(255,255,255,0.1)', padding: '10px 12px', borderRadius: '10px', borderLeft: '3px solid #DC2626' }}
        >
          <div style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>Payment received?</div>
          <div style={{ color: 'var(--text-on-dark-muted)', fontSize: '11px' }}>No confirmation · customer left</div>
        </motion.div>
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ position: 'absolute', right: '24px', bottom: '22px', width: '12px', height: '12px', borderRadius: '50%', background: '#DC2626' }} />
        <div style={{ position: 'absolute', right: '24px', top: '22px', fontSize: '44px' }}>😰</div>
      </div>
    ),
  },
  {
    title: "My settlement doesn't match what I collected.",
    body:
      'Transaction dates vs settlement dates. MDR deductions. Failed refund credits. Every night, a 45-minute spreadsheet maze. You just want to go home.',
    stat: '45 min lost · every single day',
    color: '#D97706',
    visual: (
      <div style={{ height: '200px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', padding: '18px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          {[['12,400', '12,100', 'X'], ['6,220', '6,220', 'OK'], ['4,500', '4,320', 'X']].map((row, index) => (
            <div key={index} style={{ display: 'contents' }}>
              {row.map((cell, cellIndex) => (
                <div
                  key={`${index}-${cellIndex}`}
                  style={{
                    borderRadius: '8px',
                    background: cell === 'X' ? 'rgba(220, 38, 38, 0.12)' : 'rgba(255,255,255,0.08)',
                    color: cell === 'X' ? '#FCA5A5' : 'white',
                    fontSize: '12px',
                    padding: '10px',
                    textAlign: 'center',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }} style={{ position: 'absolute', right: '18px', bottom: '16px', color: '#FCD34D', fontSize: '12px', fontWeight: 700 }}>
          38:42 ... 39:11 ... 39:55
        </motion.div>
      </div>
    ),
  },
  {
    title: 'My dispute is just... sitting there.',
    body:
      "A chargeback was raised three weeks ago. You didn't know what to write. You thought it would resolve itself. It didn't. You lost ₹2,200.",
    stat: '78% of disputes expire unresponded',
    color: '#DC2626',
    visual: (
      <div style={{ height: '200px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', padding: '20px', position: 'relative' }}>
        <motion.div
          animate={{ borderColor: ['rgba(220,38,38,0.25)', 'rgba(220,38,38,0.8)', 'rgba(220,38,38,0.25)'] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ border: '1px solid rgba(220,38,38,0.25)', borderRadius: '12px', padding: '18px', height: '100%' }}
        >
          <div style={{ color: 'white', fontWeight: 700, marginBottom: '12px' }}>Dispute response window</div>
          <div style={{ color: '#FCA5A5', fontSize: '30px', fontWeight: 800, lineHeight: 1 }}>00:00</div>
          <div style={{ color: '#FCA5A5', fontSize: '12px', marginTop: '12px' }}>EXPIRED · No response filed</div>
          <div style={{ color: 'var(--text-on-dark-muted)', fontSize: '12px', marginTop: '18px' }}>Customer wins by default.</div>
        </motion.div>
      </div>
    ),
  },
];

export function Problem() {
  return (
    <section id="problem" className="checkered-navy" style={{ padding: '120px 0', position: 'relative' }}>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <BorderReveal dark />
        <span className="label" style={{ color: 'var(--cyan)' }}>THE REAL COST OF PAYMENT CONFUSION</span>
        <h2 className="display-xl" style={{ color: 'var(--text-on-dark)', marginTop: '12px', maxWidth: '780px' }}>
          Three moments every<br />
          Indian merchant<br />
          <em style={{ color: 'var(--cyan)', fontStyle: 'italic' }}>dreads.</em>
        </h2>
        <p className="body-lg" style={{ color: 'var(--text-on-dark-muted)', maxWidth: '520px', marginTop: '20px' }}>
          It's not about technology. It's about those 10 minutes of panic when you don't know if a payment went through. Those 45 minutes every night tallying what you collected vs what settled. That one dispute that expired because no one told you what to do.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '56px' }}>
          {PROBLEMS.map((card, index) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: index * 0.12, duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0, 185, 241, 0.12)', borderRadius: '22px', padding: '18px', boxShadow: 'var(--shadow-lg)' }}
            >
              {card.visual}
              <h3 style={{ color: 'white', fontSize: '28px', lineHeight: 1.1, fontFamily: 'var(--font-display)', marginTop: '22px' }}>{card.title}</h3>
              <p style={{ color: 'var(--text-on-dark-muted)', fontSize: '15px', marginTop: '12px' }}>{card.body}</p>
              <div style={{ display: 'inline-flex', marginTop: '18px', padding: '8px 12px', borderRadius: '999px', background: `${card.color}18`, color: card.color, fontSize: '12px', fontWeight: 700 }}>
                {card.stat}
              </div>
            </motion.article>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '64px 0 0', borderTop: '1px solid rgba(0,185,241,0.15)', marginTop: '56px' }}>
          <p className="label" style={{ color: 'var(--cyan)' }}>THERE'S A BETTER WAY</p>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ fontSize: '32px', marginTop: '12px', color: 'var(--cyan)' }}>
            ↓
          </motion.div>
        </div>
      </div>
    </section>
  );
}
