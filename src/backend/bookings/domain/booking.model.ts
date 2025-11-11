

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentType = 'deposit' | 'full';
export type TicketStatus = 'valid' | 'redeemed' | 'expired';

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
  ticketStatus: TicketStatus;
  language: string;
  hotelId: string;
  hotelName: string;
  meetingPointId: string;
  meetingPointName: string;
}
