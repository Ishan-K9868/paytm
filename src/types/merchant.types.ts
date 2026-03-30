export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
}

export interface MerchantProfile {
  businessName: string;
  businessCategory: string;
  city: string;
  phoneNumber: string;
  merchantId: string;
}

export interface TodayStats {
  totalCollected: number;
  totalSettled: number;
  transactionCount: number;
  anomalyCount: number;
  pendingDisputes: number;
  successRate: number;
}

export interface AppNotification {
  id: string;
  type: 'payment_verified' | 'anomaly_detected' | 'dispute_deadline' | 'settlement_complete' | 'payment_failed';
  title: string;
  message: string;
  read: boolean;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  actionUrl?: string;
}
