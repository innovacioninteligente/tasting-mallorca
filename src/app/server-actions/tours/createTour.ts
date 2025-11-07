
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { createTour as createTourUseCase } from '@/backend/tours/application/createTour';
import { FirestoreTourRepository } from '@/backend/tours/infrastructure/firestore-tour.repository';
import { Tour } from '@/backend/tours/domain/tour.model';

// We omit 'id' and will generate it in the use case.
// Image fields will be URLs (strings) after upload.
type CreateTourInput = Omit<Tour, 'id'>;

export const createTour = createSafeAction(
  {
    allowedRoles: ['admin'],
  },
  async (
    tourData: CreateTourInput
  ): Promise<{ data?: { tourId: string }; error?: string }> => {
    try {
      const tourRepository = new FirestoreTourRepository();
      
      const newTour: Omit<Tour, 'id'> = {
        ...tourData,
        // Ensure price and duration are numbers
        price: Number(tourData.price),
        durationHours: Number(tourData.durationHours),
        // Set empty arrays if they are not provided, although schema requires them
        itinerary: tourData.itinerary || { es: [], en: [], de: [], fr: [], nl: [] },
        availabilityPeriods: tourData.availabilityPeriods || [],
      };

      const tourId = await createTourUseCase(tourRepository, newTour);

      return { data: { tourId } };
    } catch (error: any) {
      console.error('Error creating tour:', error);
      return { error: error.message || 'Failed to create tour.' };
    }
  }
);

    