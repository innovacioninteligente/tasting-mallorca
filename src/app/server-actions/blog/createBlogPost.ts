
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { createBlogPost as createBlogPostUseCase } from '@/backend/blog/application/createBlogPost';
import { FirestoreBlogRepository } from '@/backend/blog/infrastructure/firestore-blog.repository';
import { BlogPost, CreateBlogPostInputSchema, type CreateBlogPostInput } from '@/backend/blog/domain/blog.model';

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
