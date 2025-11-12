
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { 
    translateBlogPost,
} from '@/ai/flows/translate-blog-post-flow';
import { z } from 'zod';

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

export const translateBlogPost = createSafeAction(
  {
    allowedRoles: ['admin'],
    inputSchema: TranslateBlogPostInputSchema,
  },
  async (
    input: TranslateBlogPostInput,
  ): Promise<{ data?: TranslateBlogPostOutput; error?: string }> => {
    try {
      const translatedData = await translateBlogPost(input);
      return { data: translatedData };
    } catch (error: any) {
      console.error('Error in translateBlogPostAction:', error.message);
      return { error: error.message || 'Failed to translate blog post content.' };
    }
  }
);
