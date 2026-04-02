import { useEffect, useState } from 'react';
import { demoVoiceNegotiation } from '@/data/copilotDemoData';
import { geminiClient } from '@/lib/gemini';
import type { VoiceNegotiationResult } from '@/types/copilot.types';

type NegotiationPhase = 'idle' | 'contacting' | 'negotiating' | 'finalizing' | 'ready' | 'approved' | 'on_hold';

export function useVoiceNegotiator() {
  const [request, setRequest] = useState(demoVoiceNegotiation.request);
  const [quantity, setQuantity] = useState(demoVoiceNegotiation.quantity);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VoiceNegotiationResult>(demoVoiceNegotiation);
  const [phase, setPhase] = useState<NegotiationPhase>('idle');
  const [activityLog, setActivityLog] = useState<string[]>([
    'Voice agent standing by. Enter requirement and run negotiation.',
  ]);
  const [dealExecution, setDealExecution] = useState<{
    paymentReference: string;
    approvedAt: string;
    expectedDelivery: string;
  } | null>(null);

  useEffect(() => {
    void runNegotiation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pushLog = (message: string) => {
    setActivityLog((current) => [message, ...current].slice(0, 8));
  };

  const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

  const runNegotiation = async () => {
    setDealExecution(null);
    setPhase('contacting');
    setLoading(true);

    pushLog('Initiating distributor outreach over voice + WhatsApp...');
    await wait(380);
    setPhase('negotiating');
    pushLog('Negotiation round 1 complete. Counter-offers in progress...');

    const next = await geminiClient.runVoiceNegotiation({ request, quantity }).catch(() => demoVoiceNegotiation);
    await wait(320);

    setPhase('finalizing');
    pushLog(`Best provisional bid found: ${next.bestSupplier}. Finalizing terms...`);
    await wait(320);

    setResult(next);
    setPhase('ready');
    pushLog(`Negotiation complete. Estimated savings locked at Rs. ${next.totalSavings.toLocaleString('en-IN')}.`);
    setLoading(false);
  };

  const approveDeal = () => {
    if (phase !== 'ready' && phase !== 'on_hold') return;

    const bestQuote = [...result.quotes].sort((a, b) => a.negotiatedQuotePerUnit - b.negotiatedQuotePerUnit)[0];
    const now = new Date();
    const paymentReference = `PO-${now.getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const deliveryHour = now.getHours() + (bestQuote?.deliveryHours ?? 6);
    const expectedDelivery = `${String(deliveryHour % 24).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setDealExecution({
      paymentReference,
      approvedAt: now.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      expectedDelivery,
    });
    setPhase('approved');
    pushLog(`Order approved and payment initiated. Ref ${paymentReference}.`);
  };

  const holdDeal = () => {
    setDealExecution(null);
    setPhase('on_hold');
    pushLog('Deal parked on hold. Supplier quotes saved for follow-up.');
  };

  return {
    request,
    setRequest,
    quantity,
    setQuantity,
    result,
    loading,
    phase,
    approved: phase === 'approved',
    dealExecution,
    activityLog,
    approveDeal,
    holdDeal,
    runNegotiation,
  };
}
