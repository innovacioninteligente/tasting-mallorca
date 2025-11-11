

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentType = 'deposit' | 'full';

export interface Booking {
  id: string;
  tourId: string;
  userId: string;
  date: Date;
  participants: number;
  totalPrice: number;
  amountPaid: number;
  amountDue: number;
  paymentType: PaymentType;
  status: BookingStatus;
  language: string;
  hotelId: string;
  hotelName: string;
  meetingPointId: string;
  meetingPointName: string;
}
