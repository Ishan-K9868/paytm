import { useState } from 'react';
import { demoPaymentLinks } from '@/data/demoAppData';
import { paytmClient } from '@/lib/paytm';
import type { PaymentLink } from '@/types/payment.types';

export function usePaymentLinks() {
  const [links, setLinks] = useState<PaymentLink[]>(demoPaymentLinks);

  const createLink = async (payload: { amount: number; description: string; customerName?: string; customerPhone?: string; expiryLabel: string }) => {
    const id = `link-${links.length + 1}`;
    const remote = await paytmClient.createPaymentLink(payload).catch(() => undefined);
    const next: PaymentLink = {
      id: remote?.linkId ?? id,
      linkUrl: remote?.linkUrl ?? `https://payassist.app/pay/${id}`,
      amount: payload.amount,
      description: payload.description,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      expiryDate: payload.expiryLabel,
      status: 'active',
      createdAt: '30 Mar 2026, 06:15 PM',
    };

    setLinks((current) => [next, ...current]);
    return next;
  };

  const cancelLink = (id: string) => {
    setLinks((current) => current.map((item) => item.id === id ? { ...item, status: 'cancelled' } : item));
  };

  return { links, createLink, cancelLink };
}
