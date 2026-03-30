type Theme = 'light' | 'dark';

export function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      onClick={onToggle}
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 130,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 14px',
        borderRadius: '999px',
        border: '1px solid var(--border)',
        background: 'var(--surface-overlay)',
        color: 'var(--text-body)',
        boxShadow: 'var(--shadow-md)',
        backdropFilter: 'blur(18px) saturate(180%)',
        WebkitBackdropFilter: 'blur(18px) saturate(180%)',
        cursor: 'pointer',
      }}
    >
      <span style={{ fontSize: '15px', lineHeight: 1 }}>{theme === 'light' ? '☀' : '☾'}</span>
      <span style={{ fontSize: '13px', fontWeight: 700 }}>{theme === 'light' ? 'Light' : 'Dark'}</span>
    </button>
  );
}
