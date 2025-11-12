
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { GuestFeedbackSchema, type GuestFeedback, type GuestFeedbackFormValues } from '@/backend/feedback/domain/feedback.model';
import { FirestoreFeedbackRepository } from '@/backend/feedback/infrastructure/firestore-feedback.repository';
import { z } from 'zod';

export const updateGuestFeedback = createSafeAction(
  {
    allowedRoles: ['admin'],
    inputSchema: GuestFeedbackSchema.partial().extend({ id: z.string() }),
  },
  async (data: Partial<GuestFeedbackFormValues> & { id: string }): Promise<{ data?: { success: true }; error?: string }> => {
    try {
      const repository = new FirestoreFeedbackRepository();
      
      const { id, tourDate, ...rest } = data;
      
      const dataToUpdate: Partial<GuestFeedback> & { id: string } = {
          id,
          ...rest,
      };

      if (tourDate) {
          dataToUpdate.tourDate = tourDate instanceof Date ? tourDate.toISOString().split('T')[0] : tourDate;
      }

      await repository.update(dataToUpdate);

      return { data: { success: true } };
    } catch (error: any) {
      console.error('Error updating guest feedback:', error);
      return { error: 'An unexpected error occurred.' };
    }
  }
);
