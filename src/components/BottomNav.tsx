const NAV_ITEMS = [
  { id: 'hero', icon: '⚡', label: 'Home', color: '#7C3AED', bg: '#EDE9FE' },
  { id: 'live-demo', icon: '▶', label: 'Demo', color: '#00B9F1', bg: '#E0F7FF' },
  { id: 'features', icon: '✦', label: 'Features', color: '#059669', bg: '#D1FAE5' },
  { id: 'cta', icon: '→', label: 'CTA', color: '#F5A623', bg: '#FFF7ED' },
];

export function BottomNav() {
  return (
    <nav
      aria-label="Quick navigation"
      className="bottom-nav"
      style={{
        position: 'fixed',
        left: '50%',
        bottom: '20px',
        transform: 'translateX(-50%)',
        zIndex: 80,
        display: 'none',
        alignItems: 'center',
        gap: '8px',
        padding: '10px',
        borderRadius: '999px',
        background: 'rgba(250, 251, 255, 0.88)',
        backdropFilter: 'blur(18px) saturate(180%)',
        border: '1px solid rgba(0, 46, 110, 0.12)',
        boxShadow: '0 8px 32px rgba(0, 46, 110, 0.12)',
      }}
    >
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          aria-label={`Navigate to ${item.label}`}
          onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '999px',
            border: 'none',
            background: item.bg,
            color: item.color,
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          {item.icon}
        </button>
      ))}
    </nav>
  );
}
