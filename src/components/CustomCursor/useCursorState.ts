import { useState, useEffect, useCallback, useRef } from 'react';

export type CursorState = 'idle' | 'hover' | 'clicking' | 'hidden';

interface CursorStateReturn {
  state: CursorState;
  isDark: boolean;
}

export function useCursorState(): CursorStateReturn {
  const [state, setState] = useState<CursorState>(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      return 'hidden';
    }
    return 'idle';
  });
  const [isDark, setIsDark] = useState(false);
  const isMouseDown = useRef(false);

  const checkDarkBackground = useCallback((element: HTMLElement | null): boolean => {
    if (!element) return false;
    
    const darkParent = element.closest(
      '.bg-dark, [data-dark], .checkered-navy, [class*="bg-navy"], [class*="bg-\\[#001"]'
    );
    
    if (darkParent) return true;

    const computed = window.getComputedStyle(element);
    const bgColor = computed.backgroundColor;
    
    const match = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      const [, r, g, b] = match.map(Number);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
      return luminance < 80;
    }
    
    return false;
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(pointer: coarse)');
    if (media.matches) {
      return;
    }

    const handleMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const isInteractive = target.closest(
        'button, a, input, textarea, select, [role="button"], [data-cursor="hover"], [type="button"], [type="submit"]'
      );
      
      const shouldHide = target.closest('[data-cursor="none"]');
      
      if (shouldHide) {
        setState('hidden');
      } else if (isMouseDown.current) {
        setState('clicking');
      } else if (isInteractive) {
        setState('hover');
      } else {
        setState('idle');
      }
      
      setIsDark(checkDarkBackground(target));
    };

    const handleDown = () => {
      isMouseDown.current = true;
      setState('clicking');
    };
    
    const handleUp = () => {
      isMouseDown.current = false;
    };

    const handleLeave = () => {
      setState('hidden');
    };

    const handleEnter = () => {
      setState('idle');
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseenter', handleEnter);
    
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseenter', handleEnter);
    };
  }, [checkDarkBackground]);

  return { state, isDark };
}
