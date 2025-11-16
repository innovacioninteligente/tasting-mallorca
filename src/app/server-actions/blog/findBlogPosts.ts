
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { findAllBlogPosts as findAllBlogPostsUseCase, findBlogPostById as findBlogPostByIdUseCase, findBlogPostBySlug } from '@/backend/blog/application/findBlogPosts';
import { FirestoreBlogRepository } from '@/backend/blog/infrastructure/firestore-blog.repository';
import { BlogPost } from '@/backend/blog/domain/blog.model';

export const findBlogPostById = createSafeAction(
    {
        allowedRoles: ['admin'],
    },
    async (postId: string, user): Promise<{ data?: BlogPost; error?: string }> => {
        if (!user) return { error: "Authentication required" };
        try {
            const blogRepository = new FirestoreBlogRepository();
            const post = await findBlogPostByIdUseCase(blogRepository, postId);
            if (!post) {
                return { error: 'Blog post not found.' };
            }
            return { data: JSON.parse(JSON.stringify(post)) };
        } catch (error: any) {
            return { error: error.message || 'Failed to fetch blog post.' };
        }
    }
);


export const findAllBlogPosts = createSafeAction(
  {
    // Public action, no roles required.
  },
  async (_: {}): Promise<{ data?: BlogPost[]; error?: string }> => {
    try {
      const blogRepository = new FirestoreBlogRepository();
      const posts = await findAllBlogPostsUseCase(blogRepository);
      return { data: JSON.parse(JSON.stringify(posts)) };
    } catch (error: any) {
      return { error: error.message || 'Failed to fetch blog posts.' };
    }
  }
);

export const findBlogPostBySlugAndLang = createSafeAction(
    {}, // Public action
    async (slug: string, lang: string): Promise<{ data?: BlogPost; error?: string; }> => {
        try {
            const blogRepository = new FirestoreBlogRepository();
            const post = await findBlogPostBySlug(blogRepository, slug, lang);

            if (!post) {
                return { error: 'Blog post not found.' };
            }
            return { data: JSON.parse(JSON.stringify(post)) };

        } catch (error: any) {
            return { error: error.message || 'Failed to fetch blog post.' };
        }
    }
);
