export function RupeeSpine() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        right: '-18vw',
        top: '0',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        fontSize: '28vw',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        color: 'var(--navy)',
        opacity: 0.04,
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 0,
        lineHeight: 1,
      }}
    >
      ₹
    </div>
  );
}
