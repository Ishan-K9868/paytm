import { Copy, Search } from 'lucide-react';
import { demoTransactions } from '@/data/demoAppData';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { TransactionVerification } from '@/types/payment.types';

interface VerifyFormProps {
  orderId: string;
  txnAmount: string;
  recentItems: TransactionVerification[];
  setOrderId: (value: string) => void;
  setTxnAmount: (value: string) => void;
  onVerify: () => void;
}

export function VerifyForm({ orderId, txnAmount, recentItems, setOrderId, setTxnAmount, onVerify }: VerifyFormProps) {
  return (
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
        <Button className="verify-btn" onClick={onVerify} type="button">
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
            <span className="recent-status-wrap"><span className="recent-status-dot" />{item.status}</span>
            <div className="recent-copy">
              <div className="dashboard-row-title mono">{item.orderId}</div>
              <div className="dashboard-row-meta">Rs. {item.txnAmount}</div>
            </div>
            <span className="dashboard-row-meta">just now</span>
          </button>
        ))}
      </div>
    </section>
  );
}
