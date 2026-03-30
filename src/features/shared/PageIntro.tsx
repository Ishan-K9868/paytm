import type { ReactNode } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';

interface PageIntroProps {
  label: string;
  title: string;
  subtitle: string;
  actions?: ReactNode;
  children?: ReactNode;
}

export function PageIntro({ label, title, subtitle, actions, children }: PageIntroProps) {
  return (
    <PageWrapper>
      <div className="page-intro-header">
        <div className="page-intro-text">
          <span className="page-intro-label">{label}</span>
          <h1 className="page-intro-title">{title}</h1>
          <p className="page-intro-subtitle">{subtitle}</p>
        </div>
        {actions ? <div className="page-intro-actions">{actions}</div> : null}
      </div>
      {children}
    </PageWrapper>
  );
}
