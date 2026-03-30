import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { aiRoutes } from './routes/ai';
import { disputeRoutes } from './routes/dispute';
import { paymentRoutes } from './routes/payment';
import { reconciliationRoutes } from './routes/reconciliation';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'payassist-server' });
});

app.use('/api/payment', paymentRoutes);
app.use('/api/reconciliation', reconciliationRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/ai', aiRoutes);

const port = Number(process.env.PORT ?? 3001);

app.listen(port, () => {
  console.log(`PayAssist server running on :${port}`);
});
