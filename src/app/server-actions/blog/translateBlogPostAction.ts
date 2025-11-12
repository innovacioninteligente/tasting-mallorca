
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { 
    translateBlogPost as translateBlogPostFlow,
    type TranslateBlogPostInput,
    type TranslateBlogPostOutput
} from '@/ai/flows/translate-blog-post-flow';
import { z } from 'zod';

export const TranslateBlogPostActionInputSchema = z.object({
  title: z.string().describe('The title of the blog post in English.'),
  slug: z.string().describe('The URL-friendly slug in English.'),
  summary: z.string().describe('The short summary of the post in English.'),
  content: z.string().describe('The full content of the post in Markdown format, in English.'),
});

export const translateBlogPostAction = createSafeAction(
  {
    allowedRoles: ['admin'],
    inputSchema: TranslateBlogPostActionInputSchema,
  },
  async (
    input: TranslateBlogPostInput,
  ): Promise<{ data?: TranslateBlogPostOutput; error?: string }> => {
    try {
      const translatedData = await translateBlogPostFlow(input);
      return { data: translatedData };
    } catch (error: any) {
      console.error('Error in translateBlogPostAction:', error.message);
      return { error: error.message || 'Failed to translate blog post content.' };
    }
  }
);
