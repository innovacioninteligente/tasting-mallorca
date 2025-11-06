export type PaymentStatus = 'succeeded' | 'failed' | 'pending';

export interface Payment {
  id: string;
  bookingId: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
}
