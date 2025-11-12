
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { updateBlogPost as updateBlogPostUseCase } from '@/backend/blog/application/updateBlogPost';
import { FirestoreBlogRepository } from '@/backend/blog/infrastructure/firestore-blog.repository';
import { BlogPost } from '@/backend/blog/domain/blog.model';
import { z } from 'zod';

const multilingualStringSchema = z.object({
    en: z.string().min(1, { message: "El texto en inglés es requerido." }),
    de: z.string().optional(),
    fr: z.string().optional(),
    nl: z.string().optional(),
});

const formSchema = z.object({
  id: z.string().optional(),
  title: multilingualStringSchema,
  slug: multilingualStringSchema,
  summary: multilingualStringSchema,
  content: multilingualStringSchema,
  author: z.string().min(1, "El autor es requerido."),
  isFeatured: z.boolean().default(false),
  published: z.boolean().default(false),
  mainImage: z.any().refine(val => val, "La imagen principal es requerida."),
  publishedAt: z.date({ required_error: "La fecha de publicación es requerida." }),
});

type UpdateBlogPostInput = z.infer<typeof formSchema>;


export const updateBlogPost = createSafeAction(
  {
    allowedRoles: ['admin'],
    inputSchema: formSchema,
  },
  async (
    postData: UpdateBlogPostInput
  ): Promise<{ data?: { success: true }; error?: string }> => {
    try {
      const blogRepository = new FirestoreBlogRepository();

      if (!postData.id) {
          throw new Error("Post ID is required for updating.");
      }

      const postToUpdate: Partial<BlogPost> & { id: string } = { 
        ...postData,
        id: postData.id,
        publishedAt: postData.publishedAt ? new Date(postData.publishedAt) : undefined,
      };
      
      await updateBlogPostUseCase(blogRepository, postToUpdate);

      return { data: { success: true } };
    } catch (error: any) {
      console.error('Error updating blog post:', error);
      return { error: error.message || 'Failed to update blog post.' };
    }
  }
);
