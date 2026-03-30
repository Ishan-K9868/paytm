import { motion } from 'motion/react';

interface CursorCoreProps {
  isDark: boolean;
  isHovering: boolean;
}

export function CursorCore({ isDark, isHovering }: CursorCoreProps) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="cursor-core-container" style={{ position: 'relative' }}>
      {/* Glow Aura */}
      <motion.div
        className="core-glow"
        animate={prefersReducedMotion ? {} : {
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.3,
        }}
        style={{
          position: 'absolute',
          width: '40px',
          height: '40px',
          left: '50%',
          top: '50%',
          marginLeft: '-20px',
          marginTop: '-20px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(0, 185, 241, 0.5) 0%, rgba(0, 185, 241, 0.2) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(0, 185, 241, 0.6) 0%, rgba(0, 185, 241, 0.3) 50%, transparent 70%)',
          pointerEvents: 'none',
          opacity: isHovering ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Core Inner - Breathing nucleus */}
      <motion.div
        className="core-inner"
        animate={prefersReducedMotion ? {} : {
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          width: '14px',
          height: '14px',
          left: '50%',
          top: '50%',
          marginLeft: '-7px',
          marginTop: '-7px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle at 30% 30%, #FFFFFF 0%, #00B9F1 50%, #00B9F1 100%)'
            : 'radial-gradient(circle at 30% 30%, #00B9F1 0%, #002E6E 50%, #002E6E 100%)',
          boxShadow: isDark
            ? '0 0 12px rgba(0, 185, 241, 0.8), 0 0 24px rgba(0, 185, 241, 0.4)'
            : '0 0 12px rgba(0, 185, 241, 0.6), 0 0 24px rgba(0, 185, 241, 0.3)',
          pointerEvents: 'none',
          opacity: isHovering ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
      />
    </div>
  );
}
