interface AmountDisplayProps {
  amount: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSign?: boolean;
  type?: 'credit' | 'debit' | 'neutral';
}

export function AmountDisplay({ amount, className, size = 'md', type = 'neutral', showSign }: AmountDisplayProps) {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  const colorMap = {
    credit: 'var(--success)',
    debit: 'var(--error)',
    neutral: 'var(--text-primary)',
  } as const;

  const sizeMap = {
    sm: '13px',
    md: '16px',
    lg: '20px',
    xl: '28px',
  } as const;

  return (
    <span
      className={`tabular-nums ${className ?? ''}`.trim()}
      style={{
        color: colorMap[type],
        fontSize: sizeMap[size],
        fontWeight: 800,
        fontFamily: 'var(--font-display)',
      }}
    >
      {showSign && type === 'credit' ? '+' : ''}
      {showSign && type === 'debit' ? '-' : ''}
      {formatted}
    </span>
  );
}
