
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { createTour as createTourUseCase } from '@/backend/tours/application/createTour';
import { FirestoreTourRepository } from '@/backend/tours/infrastructure/firestore-tour.repository';
import { Tour } from '@/backend/tours/domain/tour.model';

type CreateTourInput = Tour;

export const createTour = createSafeAction(
  {
    allowedRoles: ['admin'],
  },
  async (
    tourData: CreateTourInput
  ): Promise<{ data?: { tourId: string }; error?: string }> => {
    try {
      const tourRepository = new FirestoreTourRepository();
      
      const newTour: Tour = {
        ...tourData,
        // Ensure numbers are correctly typed
        price: Number(tourData.price),
        durationHours: Number(tourData.durationHours),
        depositPrice: tourData.allowDeposit ? Number(tourData.depositPrice) : 0,

        // Set empty arrays if they are not provided
        itinerary: tourData.itinerary || { es: [], en: [], de: [], fr: [], nl: [] },
        availabilityPeriods: tourData.availabilityPeriods || [],
        galleryImages: tourData.galleryImages || [],
      };

      await createTourUseCase(tourRepository, newTour);

      return { data: { tourId: newTour.id } };
    } catch (error: any) {
      console.error('Error creating tour:', error);
      return { error: error.message || 'Failed to create tour.' };
    }
  }
);
