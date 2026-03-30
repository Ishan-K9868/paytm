import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth';
import { demoDisputes } from '../../src/data/demoAppData';

const upload = multer({ storage: multer.memoryStorage() });

export const disputeRoutes = Router();

disputeRoutes.use(authenticate);

disputeRoutes.get('/', (_req, res) => {
  res.json(demoDisputes);
});

disputeRoutes.post('/submit', upload.array('docs'), (req, res) => {
  res.json({
    ok: true,
    disputeId: req.body.disputeId,
    reference: `DISP-${new Date().getFullYear()}-${String(req.body.disputeId ?? '000').slice(-3)}`,
  });
});
