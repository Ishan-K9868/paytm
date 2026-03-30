import { useState } from 'react';
import { CheckCircle2, FileText, Sparkles } from 'lucide-react';
import { AmountDisplay } from '@/components/AmountDisplay';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { demoReconciliationSummary } from '@/data/demoAppData';
import { useEndOfDay } from '@/features/end-of-day/useEndOfDay';
import { PageIntro } from '@/features/shared/PageIntro';

export function EndOfDayPage() {
  const [step, setStep] = useState(0);
  const { summaryText, isGenerating, generateSummary } = useEndOfDay(step);

  return (
    <PageIntro label="Operations" subtitle="Review today's books, let PayAssist write a short summary, and export your close in a clean sequence." title="End of Day">
      <div className="eod-progress">
        {['Review', 'AI Summary', 'Export'].map((label, index) => (
          <div className={`eod-step ${index === step ? 'active' : ''} ${index < step ? 'completed' : ''}`} key={label}>
            <span className="eod-step-circle">{index + 1}</span>
            <span>{label}</span>
            {index < 2 ? <span className={`eod-connector ${index < step ? 'done' : ''}`} /> : null}
          </div>
        ))}
      </div>

      {step === 0 ? (
        <div className="placeholder-grid">
          <Card accent="cyan" className="recon-summary-card"><div className="stat-label">Total Collected</div><div className="stat-value"><AmountDisplay amount={demoReconciliationSummary.totalCollected} size="xl" /></div></Card>
          <Card accent="success" className="recon-summary-card"><div className="stat-label">Total Settled</div><div className="stat-value"><AmountDisplay amount={demoReconciliationSummary.totalSettled} size="xl" /></div></Card>
          <Card accent="warning" className="recon-summary-card"><div className="stat-label">Pending Settlement</div><div className="stat-value"><AmountDisplay amount={demoReconciliationSummary.delta} size="xl" type="debit" /></div></Card>
          <Card accent="navy" className="recon-summary-card"><div className="stat-label">Transactions</div><div className="stat-value">{demoReconciliationSummary.transactionCount}</div></Card>
          <div className="dashboard-wide-panel clean-state-card">
            <div className="dashboard-panel-title">{demoReconciliationSummary.anomalyCount > 0 ? `${demoReconciliationSummary.anomalyCount} anomalies need your attention` : 'Looks good - close the day'}</div>
            <p className="page-subtitle">Resolve reconciliation issues before generating the final close memo.</p>
            <Button onClick={() => { void generateSummary(); setStep(1); }} type="button">Proceed to AI Summary</Button>
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="eod-memo-wrap">
          <div className="eod-memo">
            <div className="memo-header"><span>AI Day Summary</span><Sparkles size={14} /></div>
            <div className="memo-text">{isGenerating ? 'PayAssist is writing your end-of-day summary...' : summaryText}</div>
          </div>
          <div className="auth-actions-row"><Button onClick={() => setStep(0)} type="button" variant="secondary">Back</Button><Button onClick={() => setStep(2)} type="button">Confirm & Export</Button></div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="export-panel">
          <CheckCircle2 size={52} color="var(--success)" />
          <div className="dashboard-panel-title">Day Closed</div>
          <div className="page-subtitle">Monday, March 30, 2026 · Closed at 9:47 PM</div>
          <div className="export-options"><Button type="button"><FileText size={14} />Export CSV</Button><Button type="button" variant="secondary"><FileText size={14} />Export PDF</Button></div>
        </div>
      ) : null}
    </PageIntro>
  );
}
