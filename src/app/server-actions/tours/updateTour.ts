
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { updateTour as updateTourUseCase } from '@/backend/tours/application/updateTour';
import { FirestoreTourRepository } from '@/backend/tours/infrastructure/firestore-tour.repository';
import { Tour, CreateTourInputSchema } from '@/backend/tours/domain/tour.model';

// We require 'id' for updates. Other fields are partial.
type UpdateTourInput = Partial<Omit<Tour, 'id'>> & { id: string };

export const updateTour = createSafeAction(
  {
    allowedRoles: ['admin'],
     inputSchema: CreateTourInputSchema.partial().extend({ id: z.string() }).omit({ availabilityPeriods: true }).extend({
        availabilityPeriods: z.array(z.object({
            startDate: z.string(),
            endDate: z.string(),
            activeDays: z.array(z.string()),
        })).optional(),
     }),
  },
  async (
    tourData: any
  ): Promise<{ data?: { success: true }; error?: string }> => {
    try {
      const tourRepository = new FirestoreTourRepository();

      const tourToUpdate: Partial<Tour> & { id: string } = { ...tourData };
      
      if (tourData.price !== undefined) tourToUpdate.price = Number(tourData.price);
      if (tourData.childPrice !== undefined) tourToUpdate.childPrice = Number(tourData.childPrice);
      if (tourData.durationHours !== undefined) tourToUpdate.durationHours = Number(tourData.durationHours);
      if (tourData.depositPrice !== undefined) tourToUpdate.depositPrice = Number(tourData.depositPrice);
      
      await updateTourUseCase(tourRepository, tourToUpdate);

      return { data: { success: true } };
    } catch (error: any) {
      console.error('Error updating tour:', error);
      return { error: error.message || 'Failed to update tour.' };
    }
  }
);
