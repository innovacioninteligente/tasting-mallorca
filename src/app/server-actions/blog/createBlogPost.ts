
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { createBlogPost as createBlogPostUseCase } from '@/backend/blog/application/createBlogPost';
import { FirestoreBlogRepository } from '@/backend/blog/infrastructure/firestore-blog.repository';
import { BlogPost } from '@/backend/blog/domain/blog.model';
import { z } from 'zod';

const multilingualStringSchema = z.object({
    en: z.string().min(1, { message: "El texto en inglés es requerido." }),
    de: z.string().optional(),
    fr: z.string().optional(),
    nl: z.string().optional(),
});

export const CreateBlogPostInputSchema = z.object({
  id: z.string().optional(),
  title: multilingualStringSchema,
  slug: multilingualStringSchema,
  summary: multilingualStringSchema,
  content: multilingualStringSchema,
  author: z.string().min(1, "El autor es requerido."),
  isFeatured: z.boolean().default(false),
  published: z.boolean().default(false),
  mainImage: z.string().min(1, "La imagen principal es requerida."),
  publishedAt: z.date({ required_error: "La fecha de publicación es requerida." }),
});

export type CreateBlogPostInput = z.infer<typeof CreateBlogPostInputSchema>;

export const createBlogPost = createSafeAction(
  {
    allowedRoles: ['admin'],
    inputSchema: CreateBlogPostInputSchema,
  },
  async (
    postData: CreateBlogPostInput
  ): Promise<{ data?: { postId: string }; error?: string }> => {
    try {
      const blogRepository = new FirestoreBlogRepository();
      
      const newPost: BlogPost = {
        ...postData,
        id: postData.id || crypto.randomUUID(),
        publishedAt: postData.publishedAt ? new Date(postData.publishedAt) : new Date(),
      };

      await createBlogPostUseCase(blogRepository, newPost);

      return { data: { postId: newPost.id } };
    } catch (error: any) {
      console.error('Error creating blog post:', error);
      return { error: error.message || 'Failed to create blog post.' };
    }
  }
);
