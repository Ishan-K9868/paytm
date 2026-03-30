import { ArrowRight, Clock3 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageIntro } from '@/features/shared/PageIntro';

interface PlaceholderFeaturePageProps {
  label: string;
  title: string;
  subtitle: string;
  accent?: 'cyan' | 'success' | 'warning' | 'error' | 'navy';
  bullets: string[];
}

export function PlaceholderFeaturePage({ label, title, subtitle, accent = 'cyan', bullets }: PlaceholderFeaturePageProps) {
  return (
    <PageIntro label={label} title={title} subtitle={subtitle}>
      <div className="placeholder-grid">
        <Card accent={accent} className="placeholder-hero-card">
          <div className="section-label">Execution Slice</div>
          <h2 className="dashboard-panel-title">This module is now routed and ready for full feature build.</h2>
          <p className="page-subtitle">
            I have scaffolded the real shell and route, so the next iterations can replace this surface with the exact PRD implementation instead of rebuilding app plumbing again.
          </p>
        </Card>

        <Card accent="navy" className="placeholder-list-card">
          <div className="dashboard-panel-header">
            <div>
              <div className="section-label">Next Build Steps</div>
              <h2 className="dashboard-panel-title">What lands here next</h2>
            </div>
            <div className="app-topbar-date-pill">
              <Clock3 size={14} />
              <span>Scaffolded today</span>
            </div>
          </div>
          <div className="dashboard-list">
            {bullets.map((bullet) => (
              <div className="dashboard-list-row" key={bullet}>
                <div className="dashboard-row-title">{bullet}</div>
                <ArrowRight size={14} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageIntro>
  );
}
