import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { demoRecommendations, voiceQueries } from '../../src/data/demoAppData';

export const aiRoutes = Router();

aiRoutes.use(authenticate);

aiRoutes.post('/explain-transaction', (req, res) => {
  const txn = req.body.txn;
  res.json({ explanation: txn?.aiExplanation ?? 'This payment is being explained in demo mode.' });
});

aiRoutes.post('/draft-dispute', (req, res) => {
  const disputeId = req.body?.dispute?.id ?? 'demo';
  res.json({
    draft: `Dear Paytm Dispute Team, this is a demo-generated response for ${disputeId}. Our records indicate the original transaction completed successfully and the merchant requests review in its favour.`,
  });
});

aiRoutes.post('/merchant-query', (req, res) => {
  const query = String(req.body.query ?? '').trim().toLowerCase();
  res.json(
    voiceQueries[query] ?? {
      answer: 'Demo mode could not match that exact question, but the app shell and AI route are now connected for the real implementation.',
      dataPoints: [{ label: 'Mode', value: 'Demo', type: 'status' }],
      suggestedActions: [{ label: 'Open dashboard', route: '/app/dashboard' }],
      confidence: 'medium',
    }
  );
});

aiRoutes.post('/eod-summary', (_req, res) => {
  res.json({ summary: 'Today collections were strong, but a few anomalies still need attention before the books feel fully clean.' });
});

aiRoutes.post('/router-analysis', (_req, res) => {
  res.json({ recommendations: demoRecommendations });
});
