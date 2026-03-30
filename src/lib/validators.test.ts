import { describe, expect, it } from 'vitest';
import { createLinkSchema, merchantIdSchema, onboardingStep1Schema } from '@/lib/validators';

describe('validators', () => {
  it('accepts valid merchant ids', () => {
    expect(merchantIdSchema.safeParse('PAYAID001').success).toBe(true);
  });

  it('rejects invalid onboarding phone numbers', () => {
    expect(
      onboardingStep1Schema.safeParse({
        businessName: 'Shop',
        businessCategory: 'Retail',
        city: 'Noida',
        phoneNumber: '12345',
      }).success
    ).toBe(false);
  });

  it('parses create link payloads', () => {
    expect(
      createLinkSchema.safeParse({
        amount: '1250',
        description: 'Advance payment',
        customerPhone: '9876543210',
        expiryDays: '7',
      }).success
    ).toBe(true);
  });
});
