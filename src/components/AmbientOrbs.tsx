import { useMouseParallax } from '../hooks/useMouseParallax';

export function AmbientOrbs() {
  const { x, y } = useMouseParallax();

  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: -200 + y * 15,
          left: -100 + x * 15,
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0, 185, 241, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'transform 0.3s ease-out',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: -150 + y * 10,
          right: -100 + x * 10,
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(245, 166, 35, 0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'transform 0.3s ease-out',
        }}
      />
    </>
  );
}
