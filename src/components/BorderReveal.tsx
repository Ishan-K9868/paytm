import { motion } from 'motion/react';

export function BorderReveal({ dark = false }: { dark?: boolean }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      style={{
        height: '1px',
        background: dark ? 'rgba(0, 185, 241, 0.18)' : 'var(--border)',
        transformOrigin: 'left',
        marginBottom: '80px',
      }}
    />
  );
}
