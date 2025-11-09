
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { findAllTours as findAllToursUseCase, findTourById as findTourByIdUseCase } from '@/backend/tours/application/findTours';
import { FirestoreTourRepository } from '@/backend/tours/infrastructure/firestore-tour.repository';
import { Tour } from '@/backend/tours/domain/tour.model';

export const findTourById = createSafeAction(
    {
        allowedRoles: ['admin'],
    },
    async (tourId: string): Promise<{ data?: Tour; error?: string }> => {
        try {
            const tourRepository = new FirestoreTourRepository();
            const tour = await findTourByIdUseCase(tourRepository, tourId);
            if (!tour) {
                return { error: 'Tour not found.' };
            }
            return { data: JSON.parse(JSON.stringify(tour)) };
        } catch (error: any) {
            return { error: error.message || 'Failed to fetch tour.' };
        }
    }
);


export const findAllTours = createSafeAction(
  {
    allowedRoles: ['admin'],
  },
  async (_: {}): Promise<{ data?: User[]; error?: string }> => {
    try {
      const tourRepository = new FirestoreTourRepository();
      const tours = await findAllToursUseCase(tourRepository);
      // The users object is converted to a plain object to avoid Next.js serialization issues.
      return { data: JSON.parse(JSON.stringify(tours)) };
    } catch (error: any) {
      return { error: error.message || 'Failed to fetch users.' };
    }
  }
);
