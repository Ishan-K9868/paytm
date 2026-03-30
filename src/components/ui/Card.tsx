import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  accent?: 'cyan' | 'success' | 'warning' | 'error' | 'navy';
}

const accentMap = {
  cyan: 'var(--cyan)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--error)',
  navy: 'var(--navy)',
} as const;

export function Card({ children, className, accent = 'cyan', style, ...props }: CardProps) {
  return (
    <div
      className={cn('card', className)}
      style={{ borderLeft: `3px solid ${accentMap[accent]}`, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
