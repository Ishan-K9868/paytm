import { useEffect, useMemo, useState } from 'react';
import { demoGenAIAdCampaign } from '@/data/copilotDemoData';
import { geminiClient } from '@/lib/gemini';
import type { GenAIAdCampaign } from '@/types/copilot.types';

type DispatchState = 'draft' | 'sending' | 'live' | 'paused';
const CREATIVE_ANGLES = ['Weekend Rush', 'Family Value', 'Fast Refill', 'Local Favourite', 'Limited Batch'];

export function useGenAIAds() {
  const [productName, setProductName] = useState(demoGenAIAdCampaign.productName);
  const [campaign, setCampaign] = useState<GenAIAdCampaign>(demoGenAIAdCampaign);
  const [loading, setLoading] = useState(false);
  const [dispatchState, setDispatchState] = useState<DispatchState>('draft');
  const [isEditing, setIsEditing] = useState(false);
  const [activityLog, setActivityLog] = useState<string[]>([
    'Draft ready. Generate or edit before launch.',
  ]);
  const [draftEdits, setDraftEdits] = useState({
    headline: demoGenAIAdCampaign.headline,
    headlineHindi: demoGenAIAdCampaign.headlineHindi,
    body: demoGenAIAdCampaign.body,
    whatsappMessage: demoGenAIAdCampaign.whatsappMessage,
  });
  const [dispatchMetrics, setDispatchMetrics] = useState({
    sent: 0,
    delivered: 0,
    clicks: 0,
    qrScans: 0,
    revenue: 0,
  });
  const [draftVersion, setDraftVersion] = useState(1);
  const [lastGeneratedAt, setLastGeneratedAt] = useState(
    new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
  );

  useEffect(() => {
    void generateCampaign();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (dispatchState !== 'live') return;

    const timer = window.setInterval(() => {
      setDispatchMetrics((current) => ({
        sent: current.sent + 12,
        delivered: current.delivered + 10,
        clicks: current.clicks + 3,
        qrScans: current.qrScans + 2,
        revenue: current.revenue + 620,
      }));
    }, 2000);

    return () => window.clearInterval(timer);
  }, [dispatchState]);

  const pushLog = (message: string) => {
    setActivityLog((current) => [message, ...current].slice(0, 8));
  };

  const normalizeProductName = (value: string) => {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : demoGenAIAdCampaign.productName;
  };

  const applyDraftVariant = (base: GenAIAdCampaign, version: number): GenAIAdCampaign => {
    const angle = CREATIVE_ANGLES[(version - 1) % CREATIVE_ANGLES.length];
    const normalizedOfferPrefix = (base.offerText.match(/[A-Z]+/i)?.[0] ?? 'SAVE').toUpperCase();
    const offerPercent = 8 + ((version * 2) % 8);
    const offerText = `${normalizedOfferPrefix}${offerPercent}`;
    const projectedReach = Math.max(220, base.projectedReach + (version % 4) * 18);
    const projectedRevenue = Math.max(9000, base.projectedRevenue + (version % 5) * 900);

    return {
      ...base,
      offerText,
      headline: `${base.headline.split(':')[0]}: ${angle} Offer Live`,
      headlineHindi: `${base.headlineHindi.split(':')[0]}: ${angle} Offer Live`,
      body: `${base.body} Angle: ${angle}.`,
      whatsappMessage: `${base.whatsappMessage} Use code ${offerText}.`,
      projectedReach,
      projectedRevenue,
      recommendation: `Draft v${version}: push this ${angle.toLowerCase()} angle between 6 PM and 8 PM for best conversion.`,
    };
  };

  const generateCampaign = async () => {
    setLoading(true);
    pushLog('Generating fresh creative draft...');
    const safeProduct = normalizeProductName(productName);
    const nextVersion = draftVersion + 1;
    const next = await geminiClient.generateAdCampaign({ productName: safeProduct }).catch(() => ({
      ...demoGenAIAdCampaign,
      productName: safeProduct,
    }));
    const variant = applyDraftVariant({ ...next, productName: safeProduct }, nextVersion);
    setCampaign(variant);
    setDraftEdits({
      headline: variant.headline,
      headlineHindi: variant.headlineHindi,
      body: variant.body,
      whatsappMessage: variant.whatsappMessage,
    });
    setDraftVersion(nextVersion);
    setLastGeneratedAt(new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }));
    setDispatchState('draft');
    setIsEditing(false);
    setDispatchMetrics({ sent: 0, delivered: 0, clicks: 0, qrScans: 0, revenue: 0 });
    pushLog(`Draft v${nextVersion} generated for ${safeProduct}.`);
    setLoading(false);
  };

  const editDraft = () => {
    setIsEditing(true);
    setDispatchState('paused');
    pushLog('Draft opened for manual edits.');
  };

  const saveDraft = () => {
    setCampaign((current) => ({
      ...current,
      headline: draftEdits.headline,
      headlineHindi: draftEdits.headlineHindi,
      body: draftEdits.body,
      whatsappMessage: draftEdits.whatsappMessage,
    }));
    setIsEditing(false);
    setDispatchState('draft');
    pushLog('Draft edits saved successfully.');
  };

  const approveAndSend = async () => {
    setDispatchState('sending');
    pushLog('Publishing campaign to WhatsApp audience...');
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    setDispatchState('live');
    setDispatchMetrics({
      sent: 120,
      delivered: 109,
      clicks: 31,
      qrScans: 19,
      revenue: 7420,
    });
    pushLog('Campaign is live. Attribution tracking started.');
  };

  const pauseCampaign = () => {
    setDispatchState('paused');
    pushLog('Campaign paused. Delivery stopped.');
  };

  const shortLink = useMemo(() => {
    const slug = campaign.offerText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `https://payassist.app/pay/campaign-${slug}`;
  }, [campaign.offerText]);

  return {
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
  };
}
