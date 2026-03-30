import { AlertTriangle, Download } from 'lucide-react';
import { AmountDisplay } from '@/components/AmountDisplay';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { PageIntro } from '@/features/shared/PageIntro';
import { useReconciliation } from '@/features/reconciliation/useReconciliation';

export function ReconciliationPage() {
  const { summary, statusFilter, setStatusFilter, search, setSearch } = useReconciliation();

  return (
    <PageIntro
      actions={<><Button type="button" variant="secondary">Export CSV</Button><Button type="button">Export PDF</Button></>}
      label="Operations"
      subtitle="Review collected vs settled values, inspect mismatches, and close books with context instead of guesswork."
      title="Reconciliation"
    >
      <div className="recon-summary-grid">
        <Card accent="cyan" className="recon-summary-card"><div className="stat-label">Total Collected</div><div className="stat-value"><AmountDisplay amount={summary.totalCollected} size="xl" /></div><div className="dashboard-row-meta">{summary.transactionCount} transactions</div></Card>
        <Card accent="success" className="recon-summary-card"><div className="stat-label">Total Settled</div><div className="stat-value"><AmountDisplay amount={summary.totalSettled} size="xl" /></div><div className="dashboard-row-meta">Rs. {summary.delta.toFixed(2)} pending review</div></Card>
        <Card accent={summary.anomalyCount > 0 ? 'error' : 'success'} className="recon-summary-card"><div className="stat-label">Anomalies</div><div className="stat-value" style={{ color: 'var(--error)' }}>{summary.anomalyCount}</div><div className="dashboard-row-meta">{summary.anomalyCount > 0 ? 'Needs manual review' : 'All clear'}</div></Card>
        <Card accent="navy" className="recon-summary-card"><div className="stat-label">Status</div><div className="status-badge-large">{summary.status.replaceAll('_', ' ')}</div><div className="dashboard-row-meta">Date: {summary.date}</div></Card>
      </div>

      {summary.anomalies.length > 0 ? (
        <Card accent="warning" className="anomaly-section">
          <div className="anomaly-section-header">
            <div className="anomaly-section-title"><AlertTriangle size={16} /> Anomaly alerts</div>
          </div>
          {summary.anomalies.map((anomaly) => (
            <div className="anomaly-card" key={anomaly.id}>
              <div className="anomaly-dot" />
              <div className="anomaly-content">
                <div className="dashboard-row-title">{anomaly.type.replaceAll('_', ' ')}</div>
                <div className="dashboard-row-meta">{anomaly.description} · {anomaly.orderId}</div>
                <div className="anomaly-expanded">{anomaly.aiExplanation}</div>
              </div>
              <div className="dashboard-row-amount"><AmountDisplay amount={anomaly.delta} type="debit" /></div>
            </div>
          ))}
        </Card>
      ) : null}

      <div className="recon-table-wrapper">
        <div className="recon-filter-bar">
          <Input className="input" onChange={(event) => setSearch(event.target.value)} placeholder="Search by Order ID, Transaction ID..." value={search} />
          <div className="filter-pill-row">
            {['all', 'matched', 'pending', 'anomaly', 'refunded'].map((filter) => (
              <button className={`filter-pill ${statusFilter === filter ? 'active' : ''}`} key={filter} onClick={() => setStatusFilter(filter as typeof statusFilter)} type="button">
                {filter.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="recon-table-head recon-row">
          <span>Date</span><span>Order ID</span><span>Method</span><span>Collected</span><span>MDR</span><span>Net Settlement</span><span>Settled</span><span>Status</span>
        </div>
        {summary.records.map((record) => (
          <div className="recon-row" data-status={record.status} key={record.orderId}>
            <span>{record.date}</span>
            <span className="orderid-cell">{record.orderId}</span>
            <span>{record.paymentMode}</span>
            <span className="amount-cell">Rs. {record.txnAmount.toFixed(2)}</span>
            <span className="amount-cell">Rs. {record.mdrAmount.toFixed(2)}</span>
            <span className="amount-cell">Rs. {record.netSettlement.toFixed(2)}</span>
            <span className="amount-cell">Rs. {(record.settledAmount ?? 0).toFixed(2)}</span>
            <span><StatusBadge status={record.status === 'matched' ? 'TXN_SUCCESS' : record.status === 'pending' ? 'PENDING' : record.status === 'refunded' ? 'REFUNDED' : 'DISPUTED'} /></span>
          </div>
        ))}
        <div className="recon-footer-row"><span>Showing {summary.records.length} of {summary.transactionCount} transactions</span><Button type="button" variant="secondary"><Download size={14} /> Save report</Button></div>
      </div>
    </PageIntro>
  );
}
