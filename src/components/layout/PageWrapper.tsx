import type { ReactNode } from 'react';

export function PageWrapper({ children }: { children: ReactNode }) {
  return <div className="app-page-wrapper">{children}</div>;
}
