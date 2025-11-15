
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { deleteTour as deleteTourUseCase } from '@/backend/tours/application/deleteTour';
import { FirestoreTourRepository } from '@/backend/tours/infrastructure/firestore-tour.repository';

export const deleteTour = createSafeAction(
  {
    allowedRoles: ['admin'],
  },
  async (tourId: string): Promise<{ data?: { success: true }; error?: string }> => {
    try {
      const tourRepository = new FirestoreTourRepository();
      await deleteTourUseCase(tourRepository, tourId);
      return { data: { success: true } };
    } catch (error: any) {
      console.error('Error deleting tour:', error);
      return { error: error.message || 'Failed to delete tour.' };
    }
  }
);
