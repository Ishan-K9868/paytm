import type { ReactNode } from 'react';

export function AuthLayout({ children, eyebrow, title, subtitle }: { children: ReactNode; eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand-row">
          <div className="app-logo-mark">P</div>
          <div>
            <div className="app-logo-name">PayAssist</div>
            <div className="app-badge">built on Paytm</div>
          </div>
        </div>
        <div className="page-header" style={{ marginBottom: '28px' }}>
          <span className="section-label">{eyebrow}</span>
          <h1 className="page-title" style={{ fontSize: '32px' }}>{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
