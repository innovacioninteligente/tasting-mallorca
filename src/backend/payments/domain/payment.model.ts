export type PaymentStatus = 'succeeded' | 'failed' | 'pending' | 'refunded';

export interface Payment {
  id: string;
  bookingId: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  refundId?: string;
  refundedAmount?: number;
  refundedAt?: Date;
  failureReason?: string;
}
