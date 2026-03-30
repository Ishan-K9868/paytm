import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Badge({ children, className, ...props }: HTMLAttributes<HTMLSpanElement> & { children: ReactNode }) {
  return (
    <span
      className={cn('app-badge-inline', className)}
      {...props}
    >
      {children}
    </span>
  );
}
