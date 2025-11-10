
'use server';
/**
 * @fileOverview An AI flow to translate tour content from English to other supported languages.
 *
 * - translateTourContent - The Genkit flow for translation.
 * - TranslateTourInput - The input type (English content).
 * - TranslateTourOutput - The return type (translated content for es, de, fr, nl).
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ItineraryItemTranslationInputSchema = z.object({
  title: z.string().optional(),
  activities: z.array(z.string()).optional(),
});

export const TranslateTourInputSchema = z.object({
  title: z.string().describe('The title of the tour in English.'),
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
export type TranslateTourInput = z.infer<typeof TranslateTourInputSchema>;

const MultilingualStringSchema = z.object({
    es: z.string().optional(),
    de: z.string().optional(),
    fr: z.string().optional(),
    nl: z.string().optional(),
});

const ItineraryItemTranslationOutputSchema = z.object({
    title: MultilingualStringSchema.optional(),
    activities: z.object({
        es: z.array(z.string()).optional(),
        de: z.array(z.string()).optional(),
        fr: z.array(z.string()).optional(),
        nl: z.array(z.string()).optional(),
    }).optional(),
});


export const TranslateTourOutputSchema = z.object({
  title: MultilingualStringSchema,
  description: MultilingualStringSchema,
  overview: MultilingualStringSchema,
  generalInfo: z.object({
    cancellationPolicy: MultilingualStringSchema,
    bookingPolicy: MultilingualStringSchema,
    guideInfo: MultilingualStringSchema,
    pickupInfo: MultilingualStringSchema,
  }),
  details: z.object({
    highlights: MultilingualStringSchema,
    fullDescription: MultilingualStringSchema,
    included: MultilingualStringSchema,
    notIncluded: MultilingualStringSchema,
    notSuitableFor: MultilingualStringSchema,
    whatToBring: MultilingualStringSchema,
    beforeYouGo: MultilingualStringSchema,
  }),
  pickupPoint: z.object({
    title: MultilingualStringSchema,
    description: MultilingualStringSchema,
  }),
  itinerary: z.array(ItineraryItemTranslationOutputSchema),
});
export type TranslateTourOutput = z.infer<typeof TranslateTourOutputSchema>;

const translateTourContentFlow = ai.defineFlow(
  {
    name: 'translateTourContentFlow',
    inputSchema: TranslateTourInputSchema,
    outputSchema: TranslateTourOutputSchema,
  },
  async (input) => {
    const prompt = `You are an expert translator specializing in creating engaging and natural-sounding tourism marketing content for a European audience. Your task is to translate the provided tour information from English into Spanish (es), German (de), French (fr), and Dutch (nl).

    **IMPORTANT INSTRUCTIONS:**
    1.  **Do not perform a literal, word-for-word translation.** Adapt the phrasing, tone, and cultural nuances to make the content appealing and natural for speakers of each target language.
    2.  **Maintain the original meaning and key information.** The core details of the tour must remain accurate.
    3.  **Translate list items individually.** For fields that are newline-separated lists (like highlights, included, etc.), translate each line as a separate item and maintain the newline-separated format in your output.
    4.  **Format your response strictly as a JSON object** that conforms to the provided output schema.
    5.  For itinerary activities, translate each tag individually.
    6.  If a source field is empty, the corresponding translated fields should also be empty strings.

    **Source Content (English):**
    - Title: {{{title}}}
    - Description: {{{description}}}
    - Overview: {{{overview}}}
    - General Info:
      - Cancellation Policy: {{{generalInfo.cancellationPolicy}}}
      - Booking Policy: {{{generalInfo.bookingPolicy}}}
      - Guide Info: {{{generalInfo.guideInfo}}}
      - Pickup Info: {{{generalInfo.pickupInfo}}}
    - Details:
      - Highlights: {{{details.highlights}}}
      - Full Description: {{{details.fullDescription}}}
      - Included: {{{details.included}}}
      - Not Included: {{{details.notIncluded}}}
      - Not Suitable For: {{{details.notSuitableFor}}}
      - What To Bring: {{{details.whatToBring}}}
      - Before You Go: {{{details.beforeYouGo}}}
    - Pickup Point:
      - Title: {{{pickupPoint.title}}}
      - Description: {{{pickupPoint.description}}}
    - Itinerary Items:
    {{#each itinerary}}
      - Item {{@index}}:
        - Title: {{this.title}}
        - Activities: {{#each this.activities}}"{{this}}"{{#unless @last}}, {{/unless}}{{/each}}
    {{/each}}
    `;

    const { output } = await ai.generate({
      prompt: prompt,
      model: 'googleai/gemini-2.5-flash',
      input: input,
      output: {
        schema: TranslateTourOutputSchema,
      },
    });
    return output!;
  }
);

export async function translateTourContent(input: TranslateTourInput): Promise<TranslateTourOutput> {
  return await translateTourContentFlow(input);
}
