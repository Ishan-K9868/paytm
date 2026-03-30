import { useMemo, useState } from 'react';
import { demoDisputes } from '@/data/demoAppData';
import { geminiClient } from '@/lib/gemini';
import { paytmClient } from '@/lib/paytm';

export function useDisputes() {
  const [selectedId, setSelectedId] = useState<string>(demoDisputes[0]?.id ?? '');
  const [drafts, setDrafts] = useState<Record<string, string>>(
    Object.fromEntries(demoDisputes.filter((item) => item.aiDraft).map((item) => [item.id, item.aiDraft as string]))
  );
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [submittedIds, setSubmittedIds] = useState<string[]>([]);

  const disputes = useMemo(() => demoDisputes.map((item) => ({
    ...item,
    aiDraft: drafts[item.id] ?? item.aiDraft,
    status: submittedIds.includes(item.id) ? 'submitted' : drafts[item.id] || item.aiDraft ? item.status === 'open' ? 'draft_ready' : item.status : item.status,
  })), [drafts, submittedIds]);

  const selected = disputes.find((item) => item.id === selectedId) ?? disputes[0] ?? null;

  const generateDraft = async (disputeId: string) => {
    setGeneratingFor(disputeId);
    await new Promise((resolve) => window.setTimeout(resolve, 1200));
    const dispute = demoDisputes.find((item) => item.id === disputeId);
    const txn = dispute ? await paytmClient.verifyTransaction(dispute.orderId).catch(() => undefined) : undefined;
    const generated = dispute && txn
      ? await geminiClient.draftDisputeResponse({ dispute, txn }).catch(() => undefined)
      : undefined;
    setDrafts((current) => ({
      ...current,
      [disputeId]: generated ?? 'Dear Paytm Dispute Team, our merchant ledger and the original gateway response confirm that this payment completed successfully and the relevant bank transaction reference was issued at the time of payment. There is no refund instruction recorded against this order, and the transaction trail supports merchant fulfilment. We request that this dispute be reviewed against the attached payment facts and resolved in the merchant\'s favour under the applicable RBI dispute framework.',
    }));
    setGeneratingFor(null);
  };

  const updateDraft = (disputeId: string, value: string) => {
    setDrafts((current) => ({ ...current, [disputeId]: value }));
  };

  const submitResponse = async (disputeId: string) => {
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    setSubmittedIds((current) => [...current, disputeId]);
  };

  return { disputes, selected, selectedId, setSelectedId, generatingFor, generateDraft, updateDraft, submitResponse, submittedIds };
}
