import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMouseParallax } from '../hooks/useMouseParallax';

const PAYMENT_EVENTS = [
  { amount: '₹540', method: 'UPI', merchant: 'Rahul Kirana', status: 'verified', time: '3:22 PM', icon: '✓', color: '#16A34A' },
  { amount: '₹1,200', method: 'QR Code', merchant: 'Priya Boutique', status: 'processing', time: '3:19 PM', icon: '⟳', color: '#00B9F1' },
  { amount: '₹89', method: 'Card', merchant: 'Ankit Tea Stall', status: 'verified', time: '3:15 PM', icon: '✓', color: '#16A34A' },
  { amount: '₹4,500', method: 'Payment Link', merchant: 'Meena Sarees', status: 'settled', time: '3:10 PM', icon: '₹', color: '#7C3AED' },
  { amount: '₹230', method: 'UPI', merchant: 'Suresh Auto Parts', status: 'verified', time: '3:08 PM', icon: '✓', color: '#16A34A' },
];

const ORBIT_CARDS = [
  { text: 'Payment Verified', sub: '₹540 · UPI · 3:22 PM', color: '#16A34A', icon: '✓' },
  { text: 'Day Closed', sub: '₹12,400 total · 0 errors', color: '#00B9F1', icon: '📊' },
  { text: 'Dispute Filed', sub: 'AI drafted in 2 clicks', color: '#F5A623', icon: '⚖️' },
  { text: 'Voice Query', sub: '"Aaj ka settlement kyon kam?"', color: '#7C3AED', icon: '🎙' },
];

const trustStats = [
  { value: '60M+', label: 'Indian SMBs' },
  { value: '₹2.4Cr', label: 'processed daily in demos' },
  { value: '<30s', label: 'to close your day' },
];

const APP_LINKS = [
  { label: 'Open Dashboard', href: '/app/dashboard' },
  { label: 'Verify Payment', href: '/app/verify' },
  { label: 'Reconciliation', href: '/app/reconciliation' },
  { label: 'Disputes', href: '/app/disputes' },
  { label: 'Voice Copilot', href: '/app/voice' },
];

export function Hero() {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const { x, y } = useMouseParallax();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % PAYMENT_EVENTS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="checkered checkered-dense checkered-fade"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '60px',
        paddingBottom: '60px',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '48px',
            alignItems: 'center',
          }}
          className="lg:!grid-cols-[1.5fr_1fr]"
        >
          {/* Left Column */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px 6px 8px',
                background: 'var(--cyan-08)',
                border: '1px solid var(--cyan-20)',
                borderRadius: 'var(--radius-pill)',
                marginBottom: '24px',
              }}
            >
              <span
                style={{
                  background: 'var(--cyan)',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                }}
              >
                NEW
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-body)', fontWeight: 500 }}>
                Built on Paytm's merchant stack — now with AI
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="display-2xl">
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                style={{ display: 'block', color: 'var(--navy)' }}
              >
                Your payments,
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                style={{ display: 'block', color: 'var(--navy)' }}
              >
                <em style={{ fontStyle: 'italic', color: 'var(--cyan)' }}>explained.</em>
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                style={{
                  display: 'block',
                  color: 'var(--text-muted)',
                  fontSize: '65%',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                }}
              >
                Not tomorrow. Right now.
              </motion.span>
            </h1>

            {/* Subheadline */}
            <motion.p
              className="body-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              style={{ color: 'var(--text-muted)', maxWidth: '480px', marginTop: '20px' }}
            >
              PayAssist is an AI copilot for Paytm merchants. Verify payments in seconds.
              Close your books without math. Handle disputes before they expire.
              Built for the 60M+ merchants who run India on a phone.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              style={{ display: 'flex', gap: '16px', marginTop: '32px', flexWrap: 'wrap' }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('live-demo')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  background: 'var(--navy)',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '16px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                See it work in 60 seconds
                <span style={{ marginLeft: '8px' }}>→</span>
              </motion.button>

              <motion.button
                whileHover={{ borderColor: 'var(--cyan)', color: 'var(--cyan)' }}
                onClick={() => window.open('https://business.paytm.com/docs/api/', '_blank', 'noopener,noreferrer')}
                style={{
                  background: 'transparent',
                  color: 'var(--navy)',
                  padding: '16px 32px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '16px',
                  fontWeight: 600,
                  border: '2px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Built on Paytm APIs ↗
              </motion.button>
            </motion.div>

            {/* Trust Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                marginTop: '40px',
                flexWrap: 'wrap',
              }}
            >
              {trustStats.map((stat, i) => (
                <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  {i > 0 && (
                    <span style={{ color: 'var(--border)', fontSize: '20px' }}>·</span>
                  )}
                  <div>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)' }}>
                      {stat.value}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '6px' }}>
                      {stat.label}
                    </span>
                  </div>
                </div>
                ))}
              </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.45 }}
              style={{ marginTop: '26px' }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
                Jump Into The Prototype
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {APP_LINKS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-pill)',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      color: 'var(--navy)',
                      fontSize: '13px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    {item.label}
                    <span aria-hidden="true">→</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            style={{
              position: 'relative',
              perspective: '1200px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            className="hidden md:flex"
          >
            <div
              style={{
                transform: `rotateY(${-8 + x * 3}deg) rotateX(${4 + y * 2}deg)`,
                transition: 'transform 0.3s ease-out',
                willChange: 'transform',
              }}
            >
              {/* Phone Frame */}
              <div
                style={{
                  width: '280px',
                  height: '580px',
                  background: 'var(--surface)',
                  borderRadius: '44px',
                  border: '8px solid var(--navy)',
                  boxShadow: `
                    0 0 0 1px rgba(0, 46, 110, 0.1),
                    0 40px 80px rgba(0, 46, 110, 0.25),
                    0 80px 120px rgba(0, 46, 110, 0.12),
                    inset 0 0 0 1px rgba(255,255,255,0.8)
                  `,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Phone Header */}
                <div
                  style={{
                    background: 'var(--navy)',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ color: 'white', fontSize: '14px', fontWeight: 700 }}>paytm</span>
                  <span style={{ color: 'var(--cyan)', fontSize: '14px', fontWeight: 700 }}>for business</span>
                </div>

                {/* Payment Stream */}
                <div style={{ padding: '16px', flex: 1 }}>
                  <AnimatePresence mode="popLayout">
                    {PAYMENT_EVENTS.slice(currentEventIndex, currentEventIndex + 3).map((event, i) => (
                      <motion.div
                        key={`${event.merchant}-${currentEventIndex}-${i}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: i * 0.1 }}
                        style={{
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          borderLeft: `3px solid ${event.color}`,
                          borderRadius: '8px',
                          padding: '12px',
                          marginBottom: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '16px' }}>
                              {event.amount}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              {event.merchant}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span
                              style={{
                                background: 'var(--cyan-08)',
                                color: 'var(--cyan)',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: 600,
                              }}
                            >
                              {event.method}
                            </span>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                              {event.time}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Mini Chart */}
                <div style={{ padding: '0 16px 20px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Today's Collection
                  </div>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '40px' }}>
                    {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                        style={{
                          flex: 1,
                          background: i === 6 ? 'var(--cyan)' : 'var(--bg-card)',
                          borderRadius: '2px',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Orbit Cards */}
              {ORBIT_CARDS.map((card, i) => (
                <div
                  key={card.text}
                  style={{
                    position: 'absolute',
                    ...(i === 0 && { top: '5%', right: '-120px' }),
                    ...(i === 1 && { top: '35%', right: '-140px' }),
                    ...(i === 2 && { bottom: '30%', left: '-130px' }),
                    ...(i === 3 && { bottom: '5%', left: '-120px' }),
                    width: '160px',
                    background: 'var(--surface)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    boxShadow: 'var(--shadow-lg)',
                    animation: `float${i + 1} ${2.9 + i * 0.4}s ease-in-out infinite`,
                    borderLeft: `3px solid ${card.color}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px' }}>{card.icon}</span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-body)' }}>
                      {card.text}
                    </span>
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{card.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
