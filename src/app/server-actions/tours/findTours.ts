
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { findAllTours as findAllToursUseCase, findTourById as findTourByIdUseCase, findTourBySlug } from '@/backend/tours/application/findTours';
import { FirestoreTourRepository } from '@/backend/tours/infrastructure/firestore-tour.repository';
import { Tour } from '@/backend/tours/domain/tour.model';
import { User } from '@/backend/users/domain/user.model';

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
            // The object needs to be serialized to be passed from Server to Client Components.
            return { data: JSON.parse(JSON.stringify(tour)) };
        } catch (error: any) {
            return { error: error.message || 'Failed to fetch tour.' };
        }
    }
);


export const findAllTours = createSafeAction(
  {
    // Public action, no roles required.
  },
  async (_: {}): Promise<{ data?: Tour[]; error?: string }> => {
    try {
      const tourRepository = new FirestoreTourRepository();
      const tours = await findAllToursUseCase(tourRepository);
      // The object needs to be serialized to be passed from Server to Client Components.
      return { data: JSON.parse(JSON.stringify(tours)) };
    } catch (error: any) {
      return { error: error.message || 'Failed to fetch tours.' };
    }
  }
);

export const findTourBySlugAndLang = createSafeAction(
    {
        // Public action, no roles required
    },
    async (params: { slug: string; lang: string; }): Promise<{ data?: Tour; error?: string; }> => {
        try {
            const tourRepository = new FirestoreTourRepository();
            const tour = await findTourBySlug(tourRepository, params.slug, params.lang);

            if (!tour) {
                return { error: 'Tour not found.' };
            }
            return { data: JSON.parse(JSON.stringify(tour)) };

        } catch (error: any) {
            return { error: error.message || 'Failed to fetch tour.' };
        }
    }
);

