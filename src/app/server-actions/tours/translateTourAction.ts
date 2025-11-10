'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { 
    translateTour,
    TranslateTourInput,
    TranslateTourOutput,
    TranslateTourInputSchema
} from '@/ai/flows/translate-tour-flow';

export const translateTourAction = createSafeAction(
  {
    allowedRoles: ['admin'],
    inputSchema: TranslateTourInputSchema,
  },
  async (
    input: TranslateTourInput,
  ): Promise<{ data?: TranslateTourOutput; error?: string }> => {
    try {
      const translatedData = await translateTour(input);
      return { data: translatedData };
    } catch (error: any) {
      console.error('Error translating tour content:', error);
      return { error: error.message || 'Failed to translate content.' };
    }
  }
);
