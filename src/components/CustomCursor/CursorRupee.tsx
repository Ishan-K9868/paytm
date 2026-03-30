import { motion, AnimatePresence } from 'framer-motion';

interface CursorRupeeProps {
  isVisible: boolean;
  isDark: boolean;
}

export const CursorRupee = ({ isVisible, isDark }: CursorRupeeProps) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Color based on dark mode
  const color = isDark ? '#FFFFFF' : '#00B9F1';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          style={{
            position: 'absolute',
            width: '22px',
            height: '22px',
            marginLeft: '-11px',
            marginTop: '-11px',
            left: '50%',
            top: '50%',
            pointerEvents: 'none',
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
          }}
          initial={{ rotate: -20, opacity: 0, scale: 0.8 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 20, opacity: 0, scale: 0.8 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.35,
            ease: [0.19, 1, 0.22, 1], // ease-out-expo
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              {/* Top horizontal line */}
              <motion.line
                x1="6"
                y1="7"
                x2="18"
                y2="7"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  delay: prefersReducedMotion ? 0 : 0,
                  duration: prefersReducedMotion ? 0 : 0.3,
                  ease: [0.42, 0, 0.58, 1],
                }}
              />

              {/* Middle horizontal line */}
              <motion.line
                x1="6"
                y1="11"
                x2="18"
                y2="11"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  delay: prefersReducedMotion ? 0 : 0.1,
                  duration: prefersReducedMotion ? 0 : 0.3,
                  ease: [0.42, 0, 0.58, 1],
                }}
              />

              {/* Vertical connector */}
              <motion.line
                x1="9"
                y1="7"
                x2="9"
                y2="11"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  delay: prefersReducedMotion ? 0 : 0.2,
                  duration: prefersReducedMotion ? 0 : 0.3,
                  ease: [0.42, 0, 0.58, 1],
                }}
              />

              {/* Curved bottom part */}
              <motion.path
                d="M 9 11 Q 13 11, 13 14 Q 13 17, 9 17"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  delay: prefersReducedMotion ? 0 : 0.3,
                  duration: prefersReducedMotion ? 0 : 0.3,
                  ease: [0.42, 0, 0.58, 1],
                }}
              />

              {/* Diagonal line */}
              <motion.line
                x1="13"
                y1="14"
                x2="18"
                y2="20"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  delay: prefersReducedMotion ? 0 : 0.4,
                  duration: prefersReducedMotion ? 0 : 0.3,
                  ease: [0.42, 0, 0.58, 1],
                }}
              />
            </g>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
