
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { 
    generateBlogPost,
    type GenerateBlogPostInput,
    type GenerateBlogPostOutput,
} from '@/ai/flows/generate-blog-post-flow';
import { createBlogPost } from './createBlogPost';
import { z } from 'zod';

const GenerateBlogPostInputSchema = z.object({
  prompt: z.string().describe("The user's idea or prompt for the blog post."),
});

export const generateBlogPostAction = createSafeAction(
  {
    allowedRoles: ['admin'],
    inputSchema: GenerateBlogPostInputSchema,
  },
  async (
    input: GenerateBlogPostInput,
  ): Promise<{ data?: { postId: string }; error?: string }> => {
    try {
      const generatedData = await generateBlogPost(input);
      
      const postData = {
        title: generatedData.title,
        slug: generatedData.slug,
        summary: generatedData.summary,
        content: generatedData.content,
        author: 'Tasting Mallorca', // Default author
        isFeatured: false,
        published: false, // Always create as draft
        mainImage: '', // Admin must add this manually
        publishedAt: new Date(),
      };

      const result = await createBlogPost(postData);

      if (result.error) throw new Error(result.error);
      if (!result.data?.postId) throw new Error("Failed to create blog post in database.");

      return { data: { postId: result.data.postId } };

    } catch (error: any) {
      console.error('Error in generateBlogPostAction:', error.message);
      return { error: error.message || 'Failed to generate blog post.' };
    }
  }
);
