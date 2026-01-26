
'use server';

import { revalidatePath } from 'next/cache';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { updateBlogPost as updateBlogPostUseCase } from '@/backend/blog/application/updateBlogPost';
import { FirestoreBlogRepository } from '@/backend/blog/infrastructure/firestore-blog.repository';
import { BlogPost, UpdateBlogPostInputSchema } from '@/backend/blog/domain/blog.model';

export const updateBlogPost = createSafeAction(
  {
    allowedRoles: ['admin'],
    inputSchema: UpdateBlogPostInputSchema,
  },
  async (
    postData: Partial<BlogPost> & { id: string }
  ): Promise<{ data?: { success: true }; error?: string }> => {
    try {
      const blogRepository = new FirestoreBlogRepository();

      if (!postData.id) {
        throw new Error("Post ID is required for updating.");
      }

      const postToUpdate = {
        ...postData,
        publishedAt: postData.publishedAt ? new Date(postData.publishedAt) : undefined,
      };

      await updateBlogPostUseCase(blogRepository, postToUpdate);

      // Revalidate pattern-based paths
      revalidatePath('/[lang]/blog/[slug]', 'page');
      revalidatePath('/[lang]/blog', 'page');
      revalidatePath('/[lang]', 'page');

      // Revalidate specific language paths if slug is available
      if (postToUpdate.slug) {
        Object.entries(postToUpdate.slug).forEach(([lang, slug]) => {
          if (slug) {
            revalidatePath(`/${lang}/blog/${slug}`, 'page');
          }
        });
      }

      return { data: { success: true } };
    } catch (error: any) {
      console.error('Error updating blog post:', error);
      return { error: error.message || 'Failed to update blog post.' };
    }
  }
);
