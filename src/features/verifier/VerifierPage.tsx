import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, CalendarDays, Copy, Link2, Search, ShieldCheck, Upload } from 'lucide-react';
import { useState } from 'react';
import { AmountDisplay } from '@/components/AmountDisplay';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { demoTransactions } from '@/data/demoAppData';
import { PageIntro } from '@/features/shared/PageIntro';
import { useVerification } from '@/features/verifier/useVerification';

export function VerifierPage() {
  const [orderId, setOrderId] = useState('PAY2024032991234');
  const [txnAmount, setTxnAmount] = useState('');
  const { state, result, error, verify, reset, recentItems } = useVerification();

  return (
    <PageIntro
      label="Payments"
      title="Verify Payment"
      subtitle="Check any order in seconds. This demo implementation follows the PRD state model with scanning, verified, mismatch, failure, and not-found states."
      actions={<><Button onClick={() => reset()} type="button" variant="secondary">Clear</Button></>}
    >
      <div className="verify-layout">
        <section className="verify-query-panel">
          <div className="dashboard-panel-header" style={{ marginBottom: 20 }}>
            <div>
              <div className="section-label">Verifier</div>
              <h2 className="dashboard-panel-title">Verify a payment</h2>
              <p className="page-subtitle">Enter an Order ID, Transaction ID, or UPI reference.</p>
            </div>
          </div>

          <div className="auth-form-grid">
            <label>
              <span className="auth-label">Order or transaction ID</span>
              <div className="verify-input-wrapper">
                <Input className="verify-input" onChange={(event) => setOrderId(event.target.value)} placeholder="PAY2024032991234" value={orderId} />
                <button className="paste-btn" onClick={() => navigator.clipboard?.readText().then((text) => setOrderId(text)).catch(() => {})} type="button">
                  <Copy size={14} />
                </button>
              </div>
            </label>
            <label>
              <span className="auth-label">Expected amount (optional)</span>
              <Input className="verify-input" onChange={(event) => setTxnAmount(event.target.value)} placeholder="1000" value={txnAmount} />
            </label>
            <Button className="verify-btn" onClick={() => void verify({ orderId, txnAmount })} type="button">
              <Search size={16} /> Verify transaction
            </Button>
          </div>

          <div className="divider-label">
            <span className="divider-line" />
            <span className="divider-text">or try a sample</span>
            <span className="divider-line" />
          </div>

          <div className="sample-pill-row">
            {Object.keys(demoTransactions).map((sampleId) => (
              <button className="sample-pill" key={sampleId} onClick={() => setOrderId(sampleId)} type="button">
                {sampleId}
              </button>
            ))}
          </div>

          <div className="recent-stack">
            <div className="app-nav-section">Recent</div>
            {recentItems.map((item) => (
              <button className="recent-item" key={item.orderId} onClick={() => setOrderId(item.orderId)} type="button">
                <StatusBadge status={item.status} />
                <div className="recent-copy">
                  <div className="dashboard-row-title mono">{item.orderId}</div>
                  <div className="dashboard-row-meta">Rs. {item.txnAmount}</div>
                </div>
                <span className="dashboard-row-meta">just now</span>
              </button>
            ))}
          </div>
        </section>

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
      </div>
    </PageIntro>
  );
}
