import fs from 'node:fs';
import path from 'node:path';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { aiRoutes } from './routes/ai.ts';
import { disputeRoutes } from './routes/dispute.ts';
import { paymentRoutes } from './routes/payment.ts';
import { reconciliationRoutes } from './routes/reconciliation.ts';

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex <= 0) {
      continue;
    }

    const key = trimmed.slice(0, equalsIndex).trim();
    const rawValue = trimmed.slice(equalsIndex + 1).trim();

    if (!key || process.env[key] !== undefined) {
      continue;
    }

    if (
      (rawValue.startsWith('"') && rawValue.endsWith('"')) ||
      (rawValue.startsWith('\'') && rawValue.endsWith('\''))
    ) {
      process.env[key] = rawValue.slice(1, -1);
      continue;
    }

    process.env[key] = rawValue;
  }
}

loadEnvFile(path.resolve(process.cwd(), '.env'));
loadEnvFile(path.resolve(process.cwd(), 'server/.env'));

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
