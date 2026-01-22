
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { updateTour as updateTourUseCase } from '@/backend/tours/application/updateTour';
import { FirestoreTourRepository } from '@/backend/tours/infrastructure/firestore-tour.repository';
import { Tour, UpdateTourInputSchema } from '@/backend/tours/domain/tour.model';
import { revalidatePath } from 'next/cache';

export const updateTour = createSafeAction(
  {
    allowedRoles: ['admin'],
    inputSchema: UpdateTourInputSchema
  },
  async (
    tourData: any
  ): Promise<{ data?: { success: true }; error?: string }> => {
    try {
      const tourRepository = new FirestoreTourRepository();

      const tourToUpdate: Partial<Tour> & { id: string } = {
        ...tourData,
        availabilityPeriods: tourData.availabilityPeriods?.map((p: any) => ({
          ...p,
          startDate: p.startDate ? new Date(p.startDate).toISOString().split('T')[0] : undefined,
          endDate: p.endDate ? new Date(p.endDate).toISOString().split('T')[0] : undefined,
        }))
      };

      if (tourData.price !== undefined) tourToUpdate.price = Number(tourData.price);
      if (tourData.childPrice !== undefined) tourToUpdate.childPrice = Number(tourData.childPrice);
      if (tourData.durationHours !== undefined) tourToUpdate.durationHours = Number(tourData.durationHours);
      if (tourData.depositPrice !== undefined) tourToUpdate.depositPrice = Number(tourData.depositPrice);

      await updateTourUseCase(tourRepository, tourToUpdate);

      revalidatePath('/[lang]/tours/[slug]', 'page');
      revalidatePath('/[lang]', 'layout');

      return { data: { success: true } };
    } catch (error: any) {
      console.error('Error updating tour:', error);
      return { error: error.message || 'Failed to update tour.' };
    }
  }
);
