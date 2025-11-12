
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { 
    translateBlogPost,
    TranslateBlogPostInput,
    TranslateBlogPostOutput,
    TranslateBlogPostInputSchema
} from '@/ai/flows/translate-blog-post-flow';

export const translateBlogPostAction = createSafeAction(
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
