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
      <div className="page-header-row">
        <div className="page-header">
          <span className="section-label">{label}</span>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
        {actions ? <div className="page-actions">{actions}</div> : null}
      </div>
      {children}
    </PageWrapper>
  );
}
