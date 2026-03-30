import { motion } from 'motion/react';

interface CursorOrbitProps {
  isDark: boolean;
  isHovering: boolean;
}

export function CursorOrbit({ isDark, isHovering }: CursorOrbitProps) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.svg
      className="cursor-orbit"
      viewBox="0 0 60 60"
      width="60"
      height="60"
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginLeft: '-30px',
        marginTop: '-30px',
        pointerEvents: 'none',
        opacity: isHovering ? 0 : 1,
        transition: 'opacity 0.3s ease',
      }}
      animate={prefersReducedMotion ? {} : { rotate: 360 }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <motion.circle
        cx="30"
        cy="30"
        r="26"
        stroke={isDark ? 'rgba(0, 185, 241, 0.7)' : '#00B9F1'}
        strokeDasharray="6 8"
        fill="none"
        strokeWidth="2"
        style={{
          opacity: 0.8,
        }}
      />
    </motion.svg>
  );
}
