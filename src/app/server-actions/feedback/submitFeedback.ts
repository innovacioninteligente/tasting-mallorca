'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { z } from 'zod';
import { getFirestore } from 'firebase-admin/firestore';
import { adminApp } from '@/firebase/server/config';

const feedbackSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  nationality: z.string().optional(),
  tourDate: z.date(),
  rating: z.number().min(1).max(5),
  experience: z.string().min(1, 'Experience description is required'),
  photoUrl: z.string().url().optional(),
});

type FeedbackInput = z.infer<typeof feedbackSchema>;

export const submitGuestFeedback = createSafeAction(
  {}, // Public action, no auth required
  async (data: FeedbackInput): Promise<{ data?: { success: true }; error?: string }> => {
    try {
      adminApp; // Ensure Firebase Admin is initialized
      const db = getFirestore();
      
      const feedbackData = {
        ...data,
        submittedAt: new Date(),
        tourDate: data.tourDate.toISOString().split('T')[0], // Store date as YYYY-MM-DD
      };

      await db.collection('guestFeedback').add(feedbackData);

      return { data: { success: true } };
    } catch (error: any) {
      console.error('Error submitting guest feedback:', error);
      return { error: 'An unexpected error occurred. Please try again later.' };
    }
  }
);
