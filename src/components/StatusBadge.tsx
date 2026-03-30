type PaymentStatus = 'TXN_SUCCESS' | 'TXN_FAILURE' | 'PENDING' | 'REFUNDED' | 'DISPUTED' | 'PROCESSING';

const statusConfig: Record<PaymentStatus, { label: string; bg: string; text: string; dot: string }> = {
  TXN_SUCCESS: { label: 'Verified', bg: 'var(--success-bg)', text: 'var(--success)', dot: 'var(--success)' },
  TXN_FAILURE: { label: 'Failed', bg: 'var(--error-bg)', text: 'var(--error)', dot: 'var(--error)' },
  PENDING: { label: 'Pending', bg: 'var(--warning-bg)', text: 'var(--warning)', dot: 'var(--warning)' },
  REFUNDED: { label: 'Refunded', bg: 'var(--info-bg)', text: 'var(--info)', dot: 'var(--info)' },
  DISPUTED: { label: 'Disputed', bg: 'var(--error-bg)', text: 'var(--error)', dot: 'var(--error)' },
  PROCESSING: { label: 'Processing', bg: 'var(--cyan-10)', text: 'var(--cyan)', dot: 'var(--cyan)' },
};

export function StatusBadge({ status }: { status: PaymentStatus }) {
  const config = statusConfig[status];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 10px',
        borderRadius: 'var(--radius-pill)',
        background: config.bg,
        color: config.text,
        fontSize: '12px',
        fontWeight: 600,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: config.dot,
          animation: status === 'PROCESSING' ? 'pulse 2s infinite' : 'none',
        }}
      />
      {config.label}
    </span>
  );
}
