import { api } from '@/lib/axiosInstance';
import type { Dispute } from '@/types/dispute.types';
import type { PaymentLink, TransactionVerification } from '@/types/payment.types';
import type { ReconciliationRecord } from '@/types/reconciliation.types';

export const paytmClient = {
  async verifyTransaction(orderId: string) {
    const { data } = await api.post('/payment/verify', { orderId });
    return data as TransactionVerification;
  },
  async getTransactionList() {
    const { data } = await api.get('/reconciliation/transactions');
    return data as ReconciliationRecord[];
  },
  async getSettlementReport(date: string) {
    const { data } = await api.get('/reconciliation/settlement', { params: { date } });
    return data as ReconciliationRecord[];
  },
  async getDisputes() {
    const { data } = await api.get('/disputes');
    return data as Dispute[];
  },
  async createPaymentLink(payload: Partial<PaymentLink>) {
    const { data } = await api.post('/payment/link', payload);
    return data as { linkUrl: string; linkId: string };
  },
};
