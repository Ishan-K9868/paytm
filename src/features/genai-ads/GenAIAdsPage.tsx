import { CheckCircle2, Megaphone, Sparkles } from 'lucide-react';
import { AmountDisplay } from '@/components/AmountDisplay';
import { Button, Card, Input } from '@/components/ui';
import { PageIntro } from '@/features/shared/PageIntro';
import { useGenAIAds } from '@/features/genai-ads/useGenAIAds';

export function GenAIAdsPage() {
  const {
    productName,
    setProductName,
    campaign,
    loading,
    dispatchState,
    isEditing,
    draftEdits,
    setDraftEdits,
    activityLog,
    dispatchMetrics,
    shortLink,
    draftVersion,
    lastGeneratedAt,
    generateCampaign,
    editDraft,
    saveDraft,
    approveAndSend,
    pauseCampaign,
  } = useGenAIAds();

  return (
    <PageIntro
      label="AI Modules"
      title="Hyper-Local GenAI Ad Engine"
      subtitle="Zero-click ad assistant that drafts local-language WhatsApp campaigns and estimates closed-loop ROI before launch."
      actions={(
        <div className="app-topbar-date-pill">
          <Megaphone size={14} />
          <span>{dispatchState === 'live' ? 'Campaign live' : dispatchState === 'sending' ? 'Sending...' : dispatchState === 'paused' ? 'Paused' : 'Draft ready'}</span>
        </div>
      )}
    >
      <div className="dashboard-grid">
        <Card accent="warning" className="dashboard-panel" style={{ gridColumn: 'span 12' }}>
          <div className="dashboard-panel-header">
            <div>
              <div className="section-label">Campaign Builder</div>
              <h2 className="dashboard-panel-title">Product-to-campaign generation</h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 10 }}>
            <Input className="input" value={productName} onChange={(event) => setProductName(event.target.value)} />
            <Button onClick={() => void generateCampaign()} type="button">
              {loading ? 'Generating...' : 'Generate draft'}
            </Button>
          </div>
          <div className="dashboard-row-meta" style={{ marginTop: 10 }}>
            Draft v{draftVersion} generated at {lastGeneratedAt}
          </div>
        </Card>

        <Card accent="navy" className="dashboard-panel" style={{ gridColumn: 'span 8' }}>
          <div className="dashboard-panel-header">
            <div>
              <div className="section-label">Generated Creative</div>
              <h2 className="dashboard-panel-title">{campaign.productName}</h2>
            </div>
            <span className={`status-pill ${dispatchState === 'live' ? 'approved' : dispatchState === 'paused' ? 'blocked' : 'pending'}`}>
              <Sparkles size={12} /> {dispatchState}
            </span>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'var(--bg-hover)' }}>
              <div className="dashboard-row-meta">Headline (EN)</div>
              {isEditing ? (
                <Input className="input" value={draftEdits.headline} onChange={(event) => setDraftEdits((current) => ({ ...current, headline: event.target.value }))} />
              ) : (
                <div className="dashboard-row-title">{campaign.headline}</div>
              )}
            </div>
            <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'var(--bg-hover)' }}>
              <div className="dashboard-row-meta">Headline (HI)</div>
              {isEditing ? (
                <Input className="input" value={draftEdits.headlineHindi} onChange={(event) => setDraftEdits((current) => ({ ...current, headlineHindi: event.target.value }))} />
              ) : (
                <div className="dashboard-row-title">{campaign.headlineHindi}</div>
              )}
            </div>
            <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'var(--bg-hover)' }}>
              <div className="dashboard-row-meta">Body Copy</div>
              {isEditing ? (
                <Input className="input" value={draftEdits.body} onChange={(event) => setDraftEdits((current) => ({ ...current, body: event.target.value }))} />
              ) : (
                <div className="dashboard-row-title">{campaign.body}</div>
              )}
            </div>
            <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'var(--bg-hover)' }}>
              <div className="dashboard-row-meta">WhatsApp Blast Message</div>
              {isEditing ? (
                <Input className="input" value={draftEdits.whatsappMessage} onChange={(event) => setDraftEdits((current) => ({ ...current, whatsappMessage: event.target.value }))} />
              ) : (
                <div className="dashboard-row-title">{campaign.whatsappMessage}</div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: '10px', background: 'var(--bg-hover)' }}>
            <div className="dashboard-row-meta">Tracking link</div>
            <div className="dashboard-row-title">{shortLink}</div>
          </div>

          <div style={{ marginTop: 12, padding: '12px 14px', borderRadius: '12px', background: 'var(--bg-hover)' }}>
            <div className="section-label">Live activity</div>
            <div style={{ display: 'grid', gap: 6, marginTop: 6 }}>
              {activityLog.map((entry) => (
                <div key={entry} className="dashboard-row-meta">- {entry}</div>
              ))}
            </div>
          </div>
        </Card>

        <Card accent="success" className="dashboard-panel" style={{ gridColumn: 'span 4' }}>
          <div className="section-label">Projected ROI</div>
          <h2 className="dashboard-panel-title" style={{ marginTop: 4 }}><AmountDisplay amount={campaign.projectedRevenue} size="lg" /></h2>
          <div className="dashboard-row-meta">Reach: {campaign.projectedReach} customers in {campaign.targetRadiusKm} km</div>
          <div className="dashboard-row-meta" style={{ marginTop: 8 }}>Offer code: <strong>{campaign.offerText}</strong></div>
          <div className="dashboard-row-meta" style={{ marginTop: 10 }}>{campaign.recommendation}</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <Button disabled={dispatchState === 'sending'} onClick={() => void approveAndSend()} type="button">
              {dispatchState === 'live' ? 'Send More' : 'Approve & Send'}
            </Button>
            {isEditing ? (
              <Button onClick={saveDraft} type="button" variant="secondary">Save Draft</Button>
            ) : (
              <Button onClick={dispatchState === 'live' ? pauseCampaign : editDraft} type="button" variant="secondary">
                {dispatchState === 'live' ? 'Pause' : 'Edit First'}
              </Button>
            )}
          </div>
          <div className="dashboard-row-meta" style={{ marginTop: 10, color: dispatchState === 'live' ? 'var(--success)' : 'var(--text-muted)' }}>
            {dispatchState === 'live'
              ? <><CheckCircle2 size={13} /> Campaign live with tracked attribution</>
              : dispatchState === 'sending'
                ? 'Dispatching to WhatsApp audience...'
                : dispatchState === 'paused'
                  ? 'Campaign paused for edits'
                  : 'Campaign not sent yet'}
          </div>

          <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: '10px', background: 'var(--bg-hover)' }}>
            <div className="dashboard-row-meta">Sent: {dispatchMetrics.sent}</div>
            <div className="dashboard-row-meta">Delivered: {dispatchMetrics.delivered}</div>
            <div className="dashboard-row-meta">Clicks: {dispatchMetrics.clicks}</div>
            <div className="dashboard-row-meta">QR scans: {dispatchMetrics.qrScans}</div>
            <div className="dashboard-row-meta">Tracked revenue: <strong>Rs. {dispatchMetrics.revenue.toLocaleString('en-IN')}</strong></div>
          </div>
        </Card>
      </div>
    </PageIntro>
  );
}
