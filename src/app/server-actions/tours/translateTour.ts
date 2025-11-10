'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { 
    translateTourContentFlow, 
    TranslateTourInputSchema, 
    type TranslateTourInput, 
    type TranslateTourOutput 
} from '@/ai/flows/translate-tour.flow';

export const translateTourContent = createSafeAction(
  {
    allowedRoles: ['admin'],
  },
  async (
    input: TranslateTourInput
  ): Promise<{ data?: TranslateTourOutput; error?: string }> => {
    try {
      // Validate input again with Zod before passing to the flow
      const validatedInput = TranslateTourInputSchema.parse(input);
      const output = await translateTourContentFlow(validatedInput);
      return { data: output };
    } catch (error: any) {
      console.error('Error translating tour content:', error);
      return { error: error.message || 'Failed to translate tour.' };
    }
  }
);
