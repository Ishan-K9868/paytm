import { useEffect, useState } from 'react';
import { useCursorState } from './useCursorState';
import { CursorCore } from './CursorCore';
import { CursorOrbit } from './CursorOrbit';
import { CursorHoverRing } from './CursorHoverRing';
import { CursorRupee } from './CursorRupee';
import { CursorRipples } from './CursorRipples';

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { state, isDark } = useCursorState();

  // Derive boolean states from cursor state
  const isHovering = state === 'hover';
  const isClicking = state === 'clicking';

  // Check screen size and touch capability
  const isLargeScreen = typeof window !== 'undefined' && window.innerWidth >= 1024;
  const isTouchDevice = typeof window !== 'undefined' && 
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  // Hide cursor on small screens or touch devices
  const shouldShowCursor = isLargeScreen && !isTouchDevice && state !== 'hidden';

  useEffect(() => {
    if (!shouldShowCursor) return;

    // Track mouse position with direct following (no spring physics)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [shouldShowCursor]);

  // Hide default cursor globally on large screens only
  useEffect(() => {
    if (shouldShowCursor) {
      const style = document.createElement('style');
      style.innerHTML = `* { cursor: none !important; }`;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }
  }, [shouldShowCursor]);

  if (!shouldShowCursor) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: mousePosition.x,
        top: mousePosition.y,
        transform: 'translate(-50%, -50%)', // ONLY transform point - critical for alignment
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      {/* Breathing nucleus with glow - visible in idle/clicking states */}
      {(state === 'idle' || state === 'clicking') && (
        <CursorCore isDark={isDark} isHovering={isHovering} />
      )}

      {/* Rotating orbit ring - visible in idle/clicking states */}
      {(state === 'idle' || state === 'clicking') && (
        <CursorOrbit isDark={isDark} isHovering={isHovering} />
      )}

      {/* Hover expansion ring with scan line - visible in hover state */}
      <CursorHoverRing isVisible={state === 'hover'} isDark={isDark} />

      {/* Rupee symbol - visible in hover state */}
      <CursorRupee isVisible={state === 'hover'} isDark={isDark} />

      {/* Click ripples and checkmark - visible when clicking */}
      <CursorRipples isClicking={isClicking} isDark={isDark} />
    </div>
  );
};

export default CustomCursor;
