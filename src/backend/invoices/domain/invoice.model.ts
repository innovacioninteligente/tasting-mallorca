export interface Invoice {
  id: string;
  bookingId: string;
  userId: string;
  issueDate: Date;
  pdfUrl?: string; // Link to PDF stored in Firebase Storage
  details: {
    tourTitle: string;
    bookingDate: Date;
    participants: number;
    pricePerParticipant: number;
    totalAmount: number;
  };
}
