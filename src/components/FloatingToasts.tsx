import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const TOAST_EVENTS = [
  { icon: '✓', text: 'Payment verified · ₹890 · UPI', merchant: 'Rajan, Nagpur', color: '#16A34A' },
  { icon: '📊', text: 'Books closed in 28 seconds', merchant: 'Sunita, Ahmedabad', color: '#00B9F1' },
  { icon: '⚖️', text: 'Dispute filed · ₹2,100 recovered', merchant: 'Deepak, Chennai', color: '#7C3AED' },
  { icon: '🎙', text: 'Voice query answered · 3 seconds', merchant: 'Kamla, Jaipur', color: '#DB2777' },
  { icon: '⚡', text: 'Anomaly detected + resolved', merchant: 'Mohan, Hyderabad', color: '#D97706' },
];

interface Toast {
  id: number;
  icon: string;
  text: string;
  merchant: string;
  color: string;
}

export function FloatingToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let id = 0;

    const addToast = () => {
      const event = TOAST_EVENTS[Math.floor(Math.random() * TOAST_EVENTS.length)];
      const newToast = { ...event, id: id++ };

      setToasts((prev) => {
        const updated = [...prev, newToast];
        return updated.slice(-3);
      });

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 4000);
    };

    addToast();
    const interval = setInterval(addToast, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        right: '24px',
        bottom: '80px',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: '12px',
        pointerEvents: 'none',
      }}
      className="hidden lg:flex"
    >
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            style={{
              width: '280px',
              background: 'white',
              borderRadius: '12px',
              padding: '12px 16px',
              boxShadow: 'var(--shadow-md)',
              borderLeft: `4px solid ${toast.color}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{ fontSize: '16px' }}>{toast.icon}</span>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-body)', margin: 0 }}>
                  {toast.text}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  {toast.merchant}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
