import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const NAV_ITEMS = [
  { id: 'hero', icon: '⚡', label: 'Home', color: '#7C3AED', bg: '#EDE9FE' },
  { id: 'problem', icon: '⚠', label: 'The Problem', color: '#DC2626', bg: '#FEE2E2' },
  { id: 'live-demo', icon: '▶', label: 'Live Demo', color: '#00B9F1', bg: '#E0F7FF' },
  { id: 'features', icon: '✦', label: 'Features', color: '#059669', bg: '#D1FAE5' },
  { id: 'how-it-works', icon: '⟳', label: 'How It Works', color: '#D97706', bg: '#FEF3C7' },
  { id: 'reconcile', icon: '⇌', label: 'Reconciliation', color: '#0891B2', bg: '#CFFAFE' },
  { id: 'stats', icon: '↑', label: 'Impact', color: '#7C3AED', bg: '#EDE9FE' },
  { id: 'voice', icon: '🎙', label: 'Voice Copilot', color: '#DB2777', bg: '#FCE7F3' },
  { id: 'apis', icon: '</>', label: 'APIs', color: '#002E6E', bg: '#EEF4FF' },
  { id: 'testimonials', icon: '❝', label: 'Stories', color: '#D97706', bg: '#FEF3C7' },
  { id: 'security', icon: '🛡', label: 'Security', color: '#059669', bg: '#D1FAE5' },
  { id: 'roi', icon: '₹', label: 'ROI Calculator', color: '#F5A623', bg: '#FFF7ED' },
];

export function SidebarNav() {
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <nav
      aria-label="Section navigator"
      className="sidebar-nav"
      style={{
        position: 'fixed',
        left: '24px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 100,
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          padding: '12px 8px',
          background: 'var(--surface-overlay)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid var(--border)',
          borderRadius: '999px',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          const isHovered = hoveredItem === item.id;

          return (
            <div key={item.id} style={{ position: 'relative' }}>
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: -8, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -8, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute',
                      left: 'calc(100% + 12px)',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: item.color,
                      color: '#FFFFFF',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      fontFamily: 'var(--font-body)',
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                      boxShadow: `0 4px 12px ${item.bg}`,
                    }}
                  >
                    {item.label}
                    <div
                      style={{
                        position: 'absolute',
                        right: '100%',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 0,
                        height: 0,
                        borderTop: '5px solid transparent',
                        borderBottom: '5px solid transparent',
                        borderRight: `5px solid ${item.color}`,
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                aria-label={`Navigate to ${item.label}`}
                onClick={() => handleClick(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                animate={{
                  scale: isActive ? 1.15 : 1,
                  backgroundColor: isActive ? item.bg : 'transparent',
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: isActive ? `2px solid ${item.color}` : '2px solid transparent',
                  background: isActive ? item.bg : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: item.icon.length > 2 ? '10px' : '16px',
                  color: item.color,
                  fontWeight: 700,
                  fontFamily: item.id === 'apis' ? 'var(--font-mono)' : 'inherit',
                  boxShadow: isActive
                    ? `0 0 0 3px ${item.color}20, 0 4px 12px ${item.color}30`
                    : 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
              >
                {item.icon}
              </motion.button>
            </div>
          );
        })}
      </motion.div>
    </nav>
  );
}
