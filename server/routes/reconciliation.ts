import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { demoReconciliationSummary } from '../../src/data/demoAppData';

export const reconciliationRoutes = Router();

reconciliationRoutes.use(authenticate);

reconciliationRoutes.get('/transactions', (_req, res) => {
  res.json(demoReconciliationSummary.records);
});

reconciliationRoutes.get('/settlement', (_req, res) => {
  res.json(
    demoReconciliationSummary.records.map((record) => ({
      orderId: record.orderId,
      settlementDate: record.settlementDate,
      netSettlement: record.settledAmount ?? 0,
      mdrAmount: record.mdrAmount,
    }))
  );
});
