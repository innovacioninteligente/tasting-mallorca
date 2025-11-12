
'use server';

import {ai} from '@/ai/genkit';
import { z } from 'zod';
import {TranslateTourOutputSchema} from "@/ai/flows/translate-tour-flow";

export const TranslateBlogPostInputSchema = z.object({
  title: z.string().describe('The title of the blog post in English.'),
  slug: z.string().describe('The URL-friendly slug in English.'),
  summary: z.string().describe('The short summary of the post in English.'),
  content: z.string().describe('The full content of the post in Markdown format, in English.'),
});
export type TranslateBlogPostInput = z.infer<typeof TranslateBlogPostInputSchema>;

const MultilingualStringSchema = z.object({
    de: z.string().optional(),
    fr: z.string().optional(),
    nl: z.string().optional(),
});

export const TranslateBlogPostOutputSchema = z.object({
  slug: MultilingualStringSchema,
  title: MultilingualStringSchema,
  summary: MultilingualStringSchema,
  content: MultilingualStringSchema,
});
export type TranslateBlogPostOutput = z.infer<typeof TranslateBlogPostOutputSchema>;


const prompt = ai.definePrompt(
    {
        name: 'translateBlogPostPrompt',
        input: { schema: TranslateBlogPostInputSchema },
        output: { schema: TranslateBlogPostOutputSchema },
        prompt: `You are an expert translator specializing in creating engaging and natural-sounding blog content for a European audience. Your task is to translate the provided blog post from English into German (de), French (fr), and Dutch (nl).

    **CRITICAL INSTRUCTIONS:**
    1.  **Do not perform a literal, word-for-word translation.** Adapt the phrasing, tone, and cultural nuances to make the content appealing and natural for speakers of each target language.
    2.  **Translate the 'slug' field.** It must be a URL-friendly version of the translated title (lowercase, hyphens for spaces, no special characters).
    3.  **Preserve Markdown Formatting:** The 'content' field is in Markdown. You MUST preserve all Markdown syntax (like ## for headers, * for lists, etc.) in your translated output.
    4.  **Format your response STRICTLY as a JSON object.** Do not wrap it in markdown backticks (\`\`\`json) or any other text.

    **Source Content (English):**
    - Title: {{{title}}}
    - Slug: {{{slug}}}
    - Summary: {{{summary}}}
    - Content (Markdown):
    ---
    {{{content}}}
    ---
`,
    }
);

const translateBlogPostFlow = ai.defineFlow(
    {
        name: 'translateBlogPostFlow',
        inputSchema: TranslateBlogPostInputSchema,
        outputSchema: TranslateBlogPostOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);

export async function translateBlogPost(input: TranslateBlogPostInput): Promise<TranslateBlogPostOutput> {
    return await translateBlogPostFlow(input);
}
