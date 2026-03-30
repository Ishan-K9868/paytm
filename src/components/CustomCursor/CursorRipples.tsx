import { motion, AnimatePresence } from 'framer-motion';

interface CursorRipplesProps {
  isClicking: boolean;
  isDark: boolean;
}

export const CursorRipples = ({ isClicking, isDark }: CursorRipplesProps) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Color based on dark mode
  const rippleColor = isDark ? 'rgba(0, 185, 241, 0.8)' : 'rgba(0, 185, 241, 0.6)';
  const checkColor = isDark ? '#FFFFFF' : '#00B9F1';

  // Ripple data with staggered delays and scales
  const ripples = [
    { delay: 0, scale: 3, opacity: 0.6 },
    { delay: 0.1, scale: 2.5, opacity: 0.4 },
    { delay: 0.2, scale: 2, opacity: 0.3 },
  ];

  return (
    <AnimatePresence>
      {isClicking && (
        <>
          {/* Three staggered ripple rings */}
          {ripples.map((ripple, index) => (
            <motion.div
              key={`ripple-${index}`}
              style={{
                position: 'absolute',
                width: '70px',
                height: '70px',
                marginLeft: '-35px',
                marginTop: '-35px',
                left: '50%',
                top: '50%',
                pointerEvents: 'none',
                border: `2px solid ${rippleColor}`,
                borderRadius: '50%',
              }}
              initial={{ scale: 0.5, opacity: ripple.opacity }}
              animate={{ scale: ripple.scale, opacity: 0 }}
              exit={{ scale: ripple.scale, opacity: 0 }}
              transition={{
                delay: prefersReducedMotion ? 0 : ripple.delay,
                duration: prefersReducedMotion ? 0 : 0.6,
                ease: [0.19, 1, 0.22, 1], // ease-out-expo
              }}
            />
          ))}

          {/* Checkmark flash */}
          <motion.div
            style={{
              position: 'absolute',
              width: '20px',
              height: '20px',
              marginLeft: '-10px',
              marginTop: '-10px',
              left: '50%',
              top: '50%',
              pointerEvents: 'none',
            }}
            initial={{ scale: 0, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.25,
              ease: [0.19, 1, 0.22, 1],
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M5 13l4 4L19 7"
                stroke={checkColor}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.3,
                  ease: [0.42, 0, 0.58, 1],
                }}
              />
            </svg>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
