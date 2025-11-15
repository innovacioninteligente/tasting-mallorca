
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { createTour as createTourUseCase } from '@/backend/tours/application/createTour';
import { FirestoreTourRepository } from '@/backend/tours/infrastructure/firestore-tour.repository';
import { Tour, CreateTourInputSchema, type CreateTourInput } from '@/backend/tours/domain/tour.model';

export const createTour = createSafeAction(
  {
    allowedRoles: ['admin'],
    inputSchema: CreateTourInputSchema,
  },
  async (
    tourData: CreateTourInput
  ): Promise<{ data?: { tourId: string }; error?: string }> => {
    try {
      const tourRepository = new FirestoreTourRepository();
      
      const newTour: Tour = {
        ...tourData,
        price: Number(tourData.price),
        childPrice: tourData.childPrice ? Number(tourData.childPrice) : 0,
        durationHours: Number(tourData.durationHours),
        depositPrice: tourData.allowDeposit ? Number(tourData.depositPrice) : 0,
        itinerary: tourData.itinerary || [],
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
