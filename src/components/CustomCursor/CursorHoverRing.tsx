import { motion, AnimatePresence } from 'framer-motion';

interface CursorHoverRingProps {
  isVisible: boolean;
  isDark: boolean;
}

export const CursorHoverRing = ({ isVisible, isDark }: CursorHoverRingProps) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Color values based on dark mode
  const borderColor1 = isDark ? 'rgba(0, 185, 241, 0.9)' : '#00B9F1';
  const borderColor2 = isDark ? 'rgba(255, 255, 255, 0.6)' : '#002E6E';
  const checkeredColor = isDark ? 'rgba(0, 185, 241, 0.25)' : 'rgba(0, 46, 110, 0.15)';
  const scanLineColor = isDark ? 'rgba(0, 185, 241, 0.8)' : 'rgba(0, 185, 241, 0.6)';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          style={{
            position: 'absolute',
            width: '70px',
            height: '70px',
            marginLeft: '-35px',
            marginTop: '-35px',
            left: '50%',
            top: '50%',
            pointerEvents: 'none',
            overflow: 'hidden',
            borderRadius: '50%',
          }}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.35,
            ease: [0.19, 1, 0.22, 1], // ease-out-expo
          }}
        >
          {/* Gradient border ring */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              padding: '3px',
              background: `linear-gradient(135deg, ${borderColor1} 0%, ${borderColor2} 100%)`,
            }}
          >
            {/* Inner circle with checkered pattern */}
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                backgroundImage: `
                  repeating-linear-gradient(
                    0deg,
                    ${checkeredColor} 0px,
                    ${checkeredColor} 1px,
                    transparent 1px,
                    transparent 10px
                  ),
                  repeating-linear-gradient(
                    90deg,
                    ${checkeredColor} 0px,
                    ${checkeredColor} 1px,
                    transparent 1px,
                    transparent 10px
                  )
                `,
                backgroundSize: '10px 10px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Horizontal scan line */}
              {!prefersReducedMotion && (
                <motion.div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: `linear-gradient(90deg, transparent 0%, ${scanLineColor} 50%, transparent 100%)`,
                    boxShadow: `0 0 8px ${scanLineColor}`,
                  }}
                  initial={{ top: 0, opacity: 0 }}
                  animate={{
                    top: ['0%', '100%'],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 0.7,
                    times: [0, 0.1, 0.9, 1],
                    ease: 'linear',
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
