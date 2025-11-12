
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { FirestoreFeedbackRepository } from '@/backend/feedback/infrastructure/firestore-feedback.repository';
import { z } from 'zod';

export const deleteGuestFeedback = createSafeAction(
  {
    allowedRoles: ['admin'],
    inputSchema: z.string(),
  },
  async (feedbackId: string): Promise<{ data?: { success: true }; error?: string }> => {
    try {
      const repository = new FirestoreFeedbackRepository();
      await repository.delete(feedbackId);
      return { data: { success: true } };
    } catch (error: any) {
      return { error: error.message || 'Failed to delete feedback.' };
    }
  }
);
