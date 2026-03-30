import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, CalendarDays, Link2, ShieldCheck, Upload } from 'lucide-react';
import { AmountDisplay } from '@/components/AmountDisplay';
import { StatusBadge } from '@/components/StatusBadge';
import type { TransactionVerification, VerifierState } from '@/types/payment.types';

interface VerifyResultProps {
  state: VerifierState;
  orderId: string;
  result: TransactionVerification | null;
  error: string | null;
}

export function VerifyResult({ state, orderId, result, error }: VerifyResultProps) {
  return (
    <section className="verify-result-panel">
      <AnimatePresence mode="wait">
        {state === 'idle' ? (
          <motion.div animate={{ opacity: 1 }} className="result-idle" exit={{ opacity: 0 }} initial={{ opacity: 0 }} key="idle">
            <ShieldCheck color="var(--border-strong)" size={48} />
            <div className="dashboard-panel-title">Waiting for query</div>
            <div className="page-subtitle">Enter an Order ID on the left to verify a payment.</div>
          </motion.div>
        ) : null}

        {state === 'scanning' ? (
          <motion.div animate={{ opacity: 1 }} className="result-idle" exit={{ opacity: 0 }} initial={{ opacity: 0 }} key="scanning">
            <div className="result-scanning">
              {[0, 1, 2].map((index) => (
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  className="scanning-dot"
                  key={index}
                  transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, delay: index * 0.15 }}
                />
              ))}
            </div>
            <div className="scan-bar-shell"><div className="scan-bar" /></div>
            <div className="dashboard-row-meta mono">Checking: {orderId}</div>
          </motion.div>
        ) : null}

        {state === 'not_found' ? (
          <motion.div animate={{ opacity: 1 }} className="result-idle" exit={{ opacity: 0 }} initial={{ opacity: 0 }} key="not_found">
            <AlertTriangle color="var(--warning)" size={48} />
            <div className="dashboard-panel-title">No transaction found</div>
            <div className="page-subtitle">{error}</div>
          </motion.div>
        ) : null}

        {result ? (
          <motion.div animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} initial={{ opacity: 0, y: 12 }} key={result.orderId}>
            <div className={`result-header-${state === 'anomaly' ? 'anomaly' : state === 'failed' ? 'failed' : 'verified'}`}>
              <div className="result-header-icon">{state === 'failed' ? '!' : state === 'anomaly' ? '!' : '✓'}</div>
              <div>
                <div className="result-header-title">{state === 'anomaly' ? 'Amount Mismatch Detected' : state === 'failed' ? 'Payment Failed' : 'Payment Verified'}</div>
                <div className="result-header-subtitle">{result.responseMsg}</div>
              </div>
            </div>
            <div className="result-body">
              <div className="result-field"><span className="field-label">Amount</span><span className="field-value amount"><AmountDisplay amount={Number(result.txnAmount)} size="xl" /></span></div>
              <div className="result-field"><span className="field-label">Status</span><span className="field-value"><StatusBadge status={result.status} /></span></div>
              <div className="result-field"><span className="field-label">Payment Mode</span><span className="field-value">{result.paymentMode}</span></div>
              <div className="result-field"><span className="field-label">Transaction ID</span><span className="field-value mono">{result.txnId ?? 'Awaiting assignment'}</span></div>
              <div className="result-field"><span className="field-label">Settlement ETA</span><span className="field-value"><CalendarDays size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />{result.settlementEta}</span></div>
              <div className="result-field"><span className="field-label">MDR Applied</span><span className="field-value">Rs. {result.mdrApplied?.toFixed(2) ?? '0.00'}</span></div>
              {state === 'anomaly' ? (
                <div className="anomaly-box">
                  The payment was successful, but the amount collected ({result.txnAmount}) does not match the expected amount ({result.expectedAmount}). Verify the customer-stated amount before closing the day.
                </div>
              ) : null}
              <div className="ai-explanation">
                <div className="ai-label">AI Explanation</div>
                <div className="ai-text">{result.aiExplanation}</div>
              </div>
              <div className="result-action-row">
                <button className="result-action-btn" type="button"><Upload size={14} /> Share</button>
                <button className="result-action-btn" type="button"><Link2 size={14} /> View in reconciliation</button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
