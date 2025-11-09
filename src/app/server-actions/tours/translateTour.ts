
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { translateTourContent as translateTourContentFlow, type TranslateTourInput, type TranslateTourOutput } from '@/ai/flows/translate-tour-flow';

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
