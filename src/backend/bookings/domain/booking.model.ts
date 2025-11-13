

import { Payment } from "@/backend/payments/domain/payment.model";
import { Tour } from "@/backend/tours/domain/tour.model";

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentType = 'deposit' | 'full';
export type TicketStatus = 'valid' | 'redeemed' | 'expired';

export interface Booking {
  id: string;
  tourId: string;
  userId: string;
  date: Date;
  adults: number;
  children: number;
  infants: number;
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
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface BookingWithDetails extends Booking {
    tour?: Tour;
    payment?: Payment;
}
