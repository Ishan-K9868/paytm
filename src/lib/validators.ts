import { z } from 'zod';

export const merchantIdSchema = z
  .string()
  .min(6, 'MID must be at least 6 characters')
  .regex(/^[A-Z0-9]+$/, 'MID must be alphanumeric uppercase');

export const transactionIdSchema = z.string().min(8, 'Transaction ID too short').max(64, 'Transaction ID too long');

export const amountSchema = z.coerce.number().positive('Amount must be positive').max(500000, 'Amount exceeds maximum limit');

export const onboardingStep1Schema = z.object({
  businessName: z.string().min(2).max(100),
  businessCategory: z.enum(['Retail', 'Food & Beverage', 'Services', 'Healthcare', 'Education', 'Other']),
  city: z.string().min(2),
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid Indian mobile number'),
});

export const createLinkSchema = z.object({
  amount: z.coerce.number().positive().max(100000),
  description: z.string().min(3).max(100),
  customerName: z.string().optional(),
  customerPhone: z.string().regex(/^[6-9]\d{9}$/).optional().or(z.literal('')),
  expiryDays: z.enum(['1', '3', '7', '30', 'never']).default('30'),
});
