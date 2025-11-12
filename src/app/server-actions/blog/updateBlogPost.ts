
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { updateBlogPost as updateBlogPostUseCase } from '@/backend/blog/application/updateBlogPost';
import { FirestoreBlogRepository } from '@/backend/blog/infrastructure/firestore-blog.repository';
import { BlogPost } from '@/backend/blog/domain/blog.model';

type UpdateBlogPostInput = Partial<Omit<BlogPost, 'id' | 'publishedAt'>> & { id: string, publishedAt?: string | Date };

export const updateBlogPost = createSafeAction(
  {
    allowedRoles: ['admin'],
  },
  async (
    postData: UpdateBlogPostInput
  ): Promise<{ data?: { success: true }; error?: string }> => {
    try {
      const blogRepository = new FirestoreBlogRepository();

      const postToUpdate: Partial<BlogPost> & { id: string } = { 
        ...postData,
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
