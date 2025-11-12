
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { 
    translateTour,
    type TranslateTourInput,
    type TranslateTourOutput,
} from '@/ai/flows/translate-tour-flow';
import { z } from 'zod';

const ItineraryItemTranslationInputSchema = z.object({
  title: z.string().optional(),
  activities: z.array(z.string()).optional(),
});

export const TranslateTourActionInputSchema = z.object({
  title: z.string().describe('The title of the tour in English.'),
  slug: z.string().describe('The URL-friendly slug in English.'),
  description: z.string().describe('The short description of the tour in English.'),
  overview: z.string().describe('The detailed overview of the tour in English.'),
  generalInfo: z.object({
    cancellationPolicy: z.string().describe('Cancellation policy text in English.'),
    bookingPolicy: z.string().describe('Booking policy text in English.'),
    guideInfo: z.string().describe('Guide information text in English.'),
    pickupInfo: z.string().describe('Pickup information text in English.'),
  }),
  details: z.object({
      highlights: z.string().describe('List of highlights, separated by newlines.'),
      fullDescription: z.string().describe('The full, detailed description.'),
      included: z.string().describe('List of what is included, separated by newlines.'),
      notIncluded: z.string().describe('List of what is not included, separated by newlines.'),
      notSuitableFor: z.string().describe('List of who this is not suitable for, separated by newlines.'),
      whatToBring: z.string().describe('List of what to bring, separated by newlines.'),
      beforeYouGo: z.string().describe('List of things to know before you go, separated by newlines.'),
  }),
  pickupPoint: z.object({
    title: z.string().describe('Pickup point main title in English.'),
    description: z.string().describe('Pickup point detailed description in English.'),
  }),
  itinerary: z.array(ItineraryItemTranslationInputSchema).describe('An array of itinerary items in English.'),
});


export const translateTourAction = createSafeAction(
  {
    allowedRoles: ['admin'],
    inputSchema: TranslateTourActionInputSchema,
  },
  async (
    input: TranslateTourInput,
  ): Promise<{ data?: TranslateTourOutput; error?: string }> => {
    try {
      const translatedData = await translateTour(input);
      return { data: translatedData };
    } catch (error: any) {
      console.error('Error in translateTourAction:', error.message);
      return { error: error.message || 'Failed to translate content.' };
    }
  }
);
