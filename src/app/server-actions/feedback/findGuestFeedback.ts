
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { FirestoreFeedbackRepository } from '@/backend/feedback/infrastructure/firestore-feedback.repository';
import { GuestFeedback } from '@/backend/feedback/domain/feedback.model';

export const findAllGuestFeedback = createSafeAction(
  {
    allowedRoles: ['admin'],
  },
  async (_: {}): Promise<{ data?: GuestFeedback[]; error?: string }> => {
    try {
      const repository = new FirestoreFeedbackRepository();
      const feedbacks = await repository.findAll();
      return { data: JSON.parse(JSON.stringify(feedbacks)) };
    } catch (error: any) {
      return { error: error.message || 'Failed to fetch guest feedback.' };
    }
  }
);
