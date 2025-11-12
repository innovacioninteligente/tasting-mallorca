
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { z } from 'zod';
import { FirestoreFeedbackRepository } from '@/backend/feedback/infrastructure/firestore-feedback.repository';

const feedbackSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  nationality: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
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
      const repository = new FirestoreFeedbackRepository();
      
      const feedbackData = {
        id: crypto.randomUUID(),
        ...data,
        submittedAt: new Date(),
        tourDate: data.tourDate.toISOString().split('T')[0], // Store date as YYYY-MM-DD
        published: false, // Default to not published
        isFeatured: false, // Default to not featured
      };

      await repository.save(feedbackData);

      return { data: { success: true } };
    } catch (error: any) {
      console.error('Detailed error submitting guest feedback:', error);
      return { error: error.message || 'An unexpected error occurred. Please try again later.' };
    }
  }
);
