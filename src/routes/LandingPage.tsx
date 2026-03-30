import { MotionConfig } from 'motion/react';
import { ReactLenis } from 'lenis/react';
import { AmbientOrbs } from '@/components/AmbientOrbs';
import { BottomNav } from '@/components/BottomNav';
import { CustomCursor } from '@/components/CustomCursor';
import { FloatingToasts } from '@/components/FloatingToasts';
import { RupeeSpine } from '@/components/RupeeSpine';
import { SidebarNav } from '@/components/SidebarNav';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ApiGrid } from '@/sections/ApiGrid';
import { Features } from '@/sections/Features';
import { FinalCta } from '@/sections/FinalCta';
import { FooterSection } from '@/sections/FooterSection';
import { Hero } from '@/sections/Hero';
import { HowItWorks } from '@/sections/HowItWorks';
import { LiveDemo } from '@/sections/LiveDemo';
import { Problem } from '@/sections/Problem';
import { Reconcile } from '@/sections/Reconcile';
import { Roi } from '@/sections/Roi';
import { Security } from '@/sections/Security';
import { Stats } from '@/sections/Stats';
import { Testimonials } from '@/sections/Testimonials';
import { Voice } from '@/sections/Voice';

interface LandingPageProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function LandingPage({ theme, onToggleTheme }: LandingPageProps) {
  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root options={{ lerp: 0.08, duration: 1.8, smoothWheel: true, syncTouch: false }}>
        <a
          href="#main-content"
          style={{
            position: 'absolute',
            top: '-100px',
            left: 0,
            zIndex: 9999,
            padding: '8px 16px',
            background: '#000',
            color: '#fff',
            borderRadius: '0 0 4px 0',
          }}
          onFocus={(event) => {
            event.currentTarget.style.top = '0';
          }}
          onBlur={(event) => {
            event.currentTarget.style.top = '-100px';
          }}
        >
          Skip to main content
        </a>
        <CustomCursor />
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <RupeeSpine />
        <AmbientOrbs />
        <SidebarNav />
        <BottomNav />
        <FloatingToasts />
        <main id="main-content" style={{ position: 'relative', zIndex: 1 }}>
          <Hero />
          <Problem />
          <LiveDemo />
          <Features />
          <HowItWorks />
          <Reconcile />
          <Stats />
          <Voice />
          <ApiGrid />
          <Testimonials />
          <Security />
          <Roi />
          <FinalCta />
        </main>
        <FooterSection />
      </ReactLenis>
    </MotionConfig>
  );
}
