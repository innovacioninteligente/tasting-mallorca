
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { GuestFeedbackSchema, type GuestFeedback, type GuestFeedbackFormValues } from '@/backend/feedback/domain/feedback.model';
import { FirestoreFeedbackRepository } from '@/backend/feedback/infrastructure/firestore-feedback.repository';

export const createGuestFeedback = createSafeAction(
  {
    allowedRoles: ['admin'],
    inputSchema: GuestFeedbackSchema,
  },
  async (data: GuestFeedbackFormValues): Promise<{ data?: { feedbackId: string }; error?: string }> => {
    try {
      const repository = new FirestoreFeedbackRepository();
      
      const newFeedback: GuestFeedback = {
        id: crypto.randomUUID(),
        name: data.name,
        nationality: data.nationality,
        tourDate: data.tourDate.toISOString().split('T')[0],
        rating: data.rating,
        experience: data.experience,
        photoUrl: data.photoUrl,
        submittedAt: new Date(),
        published: data.published,
        isFeatured: data.isFeatured,
      };

      await repository.save(newFeedback);

      return { data: { feedbackId: newFeedback.id } };
    } catch (error: any) {
      console.error('Error creating guest feedback:', error);
      return { error: 'An unexpected error occurred.' };
    }
  }
);
