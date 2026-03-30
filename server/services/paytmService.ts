export interface MerchantCredentials {
  merchantId: string;
  merchantKey: string;
  website: string;
  channelId: string;
  industryType: string;
}

export async function getMerchantCredentials(): Promise<MerchantCredentials> {
  return {
    merchantId: process.env.PAYTM_MERCHANT_ID_DEV ?? 'DEMO_MID',
    merchantKey: process.env.PAYTM_MERCHANT_KEY_DEV ?? 'DEMO_KEY',
    website: process.env.PAYTM_WEBSITE_DEV ?? 'WEBSTAGING',
    channelId: process.env.PAYTM_CHANNEL_ID_DEV ?? 'WEB',
    industryType: process.env.PAYTM_INDUSTRY_TYPE_DEV ?? 'Retail',
  };
}

export async function generateChecksum(params: Record<string, string>) {
  void params;
  return 'demo-checksum';
}
