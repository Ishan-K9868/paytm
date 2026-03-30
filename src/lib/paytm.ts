import { demoDisputes, demoPaymentLinks, demoReconciliationSummary, demoTransactions } from '@/data/demoAppData';
import type { Dispute } from '@/types/dispute.types';
import type { PaymentLink, TransactionVerification } from '@/types/payment.types';
import type { ReconciliationRecord } from '@/types/reconciliation.types';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export const paytmClient = {
  async verifyTransaction(orderId: string) {
    const normalized = orderId.trim().toLowerCase();
    const transaction = Object.values(demoTransactions).find((item) => {
      return item.orderId.toLowerCase() === normalized || item.txnId?.toLowerCase() === normalized;
    });

    if (!transaction) {
      throw new Error('Transaction not found in simulated mode.');
    }

    return clone(transaction) as TransactionVerification;
  },

  async getTransactionList() {
    return clone(demoReconciliationSummary.records) as ReconciliationRecord[];
  },

  async getSettlementReport(date: string) {
    void date;
    return clone(demoReconciliationSummary.records) as ReconciliationRecord[];
  },

  async getDisputes() {
    return clone(demoDisputes) as Dispute[];
  },

  async createPaymentLink(payload: Partial<PaymentLink>) {
    const id = `link-local-${Date.now()}`;
    const match = demoPaymentLinks.find((item) => item.amount === payload.amount && item.description === payload.description);
    return {
      linkUrl: match?.linkUrl ?? `https://payassist.app/pay/${id}`,
      linkId: id,
    };
  },
};
