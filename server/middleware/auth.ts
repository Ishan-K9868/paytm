import type { NextFunction, Request, Response } from 'express';

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  req.headers['x-payassist-auth-mode'] = 'demo';
  next();
}
