import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useMotionValueEvent, useSpring } from 'motion/react';

const STATS = [
  { value: 60000000, display: '60M+', label: 'Indian SMBs on Paytm', sublabel: 'The merchants PayAssist is built for', color: 'var(--cyan)', textOnDark: true },
  { value: 45, display: '45 min', label: 'Lost daily to manual reconciliation', sublabel: 'Per merchant, every single night', color: 'var(--amber)', textOnDark: true },
  { value: 30, display: '<30s', label: 'To close your day with PayAssist', sublabel: 'From 45 minutes to 30 seconds', color: 'var(--cyan)', textOnDark: false },
  { value: 78, display: '78%', label: 'Of disputes expire unresponded', sublabel: 'PayAssist brings this to near zero', color: 'var(--amber)', textOnDark: false },
];

function AnimatedCounter({ value, display }: { value: number; display: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { mass: 0.8, stiffness: 75, damping: 15 });
  const [latest, setLatest] = useState(0);

  useMotionValueEvent(springValue, 'change', (next) => setLatest(next));

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  const rendered = display.includes('M') ? `${Math.round(latest / 1000000)}M+` : display.includes('min') ? `${Math.round(latest)} min` : display.includes('%') ? `${Math.round(latest)}%` : `<${Math.max(1, Math.round(latest))}s`;
  return <span ref={ref} className="tabular-nums">{rendered}</span>;
}

export function Stats() {
  return (
    <section id="stats" style={{ position: 'relative', background: 'var(--bg-dark)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', background: 'var(--bg-base)', clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)' }} aria-hidden="true" />
      <div className="container" style={{ position: 'relative', zIndex: 1, padding: '100px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '22px' }} className="lg:grid lg:grid-cols-4">
          {STATS.map((stat) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} style={{ padding: '24px', borderRadius: '24px', background: stat.textOnDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.78)', border: stat.textOnDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
              <svg viewBox="0 0 180 60" style={{ width: '100%', height: '42px', opacity: 0.22 }} aria-hidden="true"><path d="M5 54 C 28 40, 32 22, 58 26 S 90 52, 118 28 S 150 12, 175 22" fill="none" stroke={stat.color} strokeWidth="3" /></svg>
              <div style={{ color: stat.color, fontSize: '44px', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1, marginTop: '12px' }}><AnimatedCounter value={stat.value} display={stat.display} /></div>
              <div style={{ color: stat.textOnDark ? 'white' : 'var(--navy)', fontWeight: 700, marginTop: '14px' }}>{stat.label}</div>
              <div style={{ color: stat.textOnDark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)', fontSize: '13px', marginTop: '8px' }}>{stat.sublabel}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
