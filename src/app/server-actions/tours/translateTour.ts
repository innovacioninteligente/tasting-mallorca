
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { translateTourContent as translateTourContentFlow, TranslateTourInputSchema as FlowInputSchema, type TranslateTourOutput } from '@/ai/flows/translate-tour.flow';
import { z } from 'zod';

export const TranslateTourInputSchema = FlowInputSchema;
export type TranslateTourInput = z.infer<typeof TranslateTourInputSchema>;

export const translateTourContent = createSafeAction(
    {
        allowedRoles: ['admin'],
    },
    async (
        input: TranslateTourInput,
    ): Promise<{ data?: TranslateTourOutput; error?: string; }> => {
        try {
            const translatedData = await translateTourContentFlow(input);
            return { data: translatedData };
        } catch (error: any) {
            console.error("Translation flow failed:", error);
            return { error: error.message || "Failed to translate tour content." };
        }
    }
);

    