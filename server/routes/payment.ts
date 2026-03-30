import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { apiRateLimiter } from '../middleware/rateLimit';
import { demoPaymentLinks, demoTransactions } from '../../src/data/demoAppData';

export const paymentRoutes = Router();

paymentRoutes.use(apiRateLimiter);
paymentRoutes.use(authenticate);

paymentRoutes.post('/verify', (req, res) => {
  const orderId = String(req.body.orderId ?? '').trim();
  const transaction = demoTransactions[orderId];

  if (!transaction) {
    res.status(404).json({ message: 'Transaction not found in demo mode.' });
    return;
  }

  res.json(transaction);
});

paymentRoutes.post('/link', (req, res) => {
  const id = `link-${demoPaymentLinks.length + 1}`;

  res.json({
    linkId: id,
    linkUrl: `https://payassist.app/pay/${id}`,
    payload: req.body,
  });
});
