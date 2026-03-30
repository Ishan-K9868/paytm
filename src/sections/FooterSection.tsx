const FOOTER_LINKS = {
  Product: [
    { label: 'Payment Verifier', href: '#live-demo' },
    { label: 'Smart Reconciliation', href: '#reconcile' },
    { label: 'Dispute Copilot', href: '#features' },
    { label: 'Voice Copilot', href: '#voice' },
    { label: 'AI Router Insights', href: '#features' },
  ],
  Compliance: [
    { label: 'DPDP 2023 Compliance', href: 'https://www.meity.gov.in/' },
    { label: 'RBI Framework', href: 'https://www.rbi.org.in/' },
    { label: 'Data Retention Policy', href: 'https://business.paytm.com/privacy/' },
    { label: 'Security Overview', href: '#security' },
  ],
  'Built With': [
    { label: 'Paytm PG APIs', href: 'https://business.paytm.com/docs/api/' },
    { label: 'Gemini AI', href: 'https://deepmind.google/technologies/gemini/' },
    { label: 'React + TypeScript', href: 'https://react.dev/' },
    { label: 'Open source', href: 'https://github.com/' },
  ],
};

function navigate(href: string) {
  if (href.startsWith('#')) {
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  window.open(href, '_blank', 'noopener,noreferrer');
}

export function FooterSection() {
  return (
    <footer className="footer-shell checkered-navy" style={{ backgroundColor: '#000D24', color: 'white', padding: '84px 0 28px', position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        <div className="footer-grid" style={{ alignItems: 'start' }}>
          <div className="footer-brand-panel">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '999px', background: 'rgba(0,185,241,0.12)', border: '1px solid rgba(0,185,241,0.18)', color: 'var(--cyan)', fontSize: '12px', fontWeight: 700 }}>
              Paytm merchant copilot
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 800, marginTop: '18px', lineHeight: 0.95 }}>PayAssist</div>
            <div style={{ color: 'var(--text-on-dark-muted)', marginTop: '14px', maxWidth: '320px', fontSize: '18px', lineHeight: 1.7 }}>
              Built on Paytm. Made for India's merchants who need payment clarity before the shop shutters come down.
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '22px' }}>
              {['DPDP compliant', 'Voice-first', 'Built on real APIs'].map((pill) => (
                <span key={pill} style={{ padding: '8px 12px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '12px', fontWeight: 600 }}>
                  {pill}
                </span>
              ))}
            </div>
            <div style={{ marginTop: '28px', padding: '18px 20px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(0,185,241,0.12) 0%, rgba(245,166,35,0.12) 100%)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 16px 48px rgba(0, 46, 110, 0.16)' }}>
              <div className="label" style={{ color: 'var(--cyan)' }}>Hackathon build</div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '18px', marginTop: '10px' }}>Fin-O-Hack 2026</div>
              <div style={{ color: 'var(--text-on-dark-muted)', marginTop: '6px', fontSize: '14px' }}>ASSETS DTU × Paytm · Designed to show, not tell.</div>
            </div>
          </div>

          <div className="footer-links-panel">
            <div className="footer-links-grid">
              {Object.entries(FOOTER_LINKS).map(([title, links]) => (
                <div key={title}>
                  <div style={{ color: 'white', fontWeight: 700, marginBottom: '14px', fontSize: '15px' }}>{title}</div>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {links.map((link) => (
                      <button key={link.label} onClick={() => navigate(link.href)} style={{ textAlign: 'left', background: 'transparent', border: 'none', color: 'var(--text-on-dark-muted)', cursor: 'pointer', padding: 0, fontSize: '15px', transition: 'color 0.2s ease, transform 0.2s ease' }} onMouseEnter={(event) => { event.currentTarget.style.color = 'white'; event.currentTarget.style.transform = 'translateX(4px)'; }} onMouseLeave={(event) => { event.currentTarget.style.color = 'var(--text-on-dark-muted)'; event.currentTarget.style.transform = 'translateX(0)'; }}>
                        {link.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '32px', paddingTop: '18px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '12px', justifyContent: 'space-between', flexWrap: 'wrap', color: 'var(--text-on-dark-muted)', fontSize: '13px' }}>
          <div>© 2026 PayAssist</div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={() => window.open('https://business.paytm.com/privacy/', '_blank', 'noopener,noreferrer')} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>Privacy</button>
            <button onClick={() => window.open('https://paytm.com/terms-of-use-paytm', '_blank', 'noopener,noreferrer')} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>Terms</button>
            <span>Built for Fin-O-Hack 2026 · ASSETS DTU × Paytm</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
