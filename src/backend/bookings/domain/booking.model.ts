
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  tourId: string;
  userId: string;
  date: Date;
  participants: number;
  totalPrice: number;
  status: BookingStatus;
  paymentId: string; // Corresponds to Stripe Payment Intent ID
  language: string;
  hotelId: string;
  hotelName: string;
  meetingPointId: string;
  meetingPointName: string;
}
