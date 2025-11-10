'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { translateTourContent as translateTourContentFlow, TranslateTourInput, TranslateTourOutput } from '@/ai/flows/translate-tour.flow';

export const translateTourContent = createSafeAction(
  {
    allowedRoles: ['admin'],
  },
  async (
    input: TranslateTourInput
  ): Promise<{ data?: TranslateTourOutput; error?: string }> => {
    try {
      const result = await translateTourContentFlow(input);
      if (result.error) {
        throw new Error(result.error);
      }
      return { data: result.data };
    } catch (error: any) {
      console.error('Error translating tour content:', error);
      return { error: error.message || 'Failed to translate tour.' };
    }
  }
);
