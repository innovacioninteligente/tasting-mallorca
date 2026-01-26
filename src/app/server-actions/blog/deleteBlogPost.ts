'use server';

import { revalidatePath } from 'next/cache';
import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { FirestoreBlogRepository } from '@/backend/blog/infrastructure/firestore-blog.repository';
import { z } from 'zod';

const DeleteBlogPostSchema = z.object({
    id: z.string(),
    slug: z.record(z.string()).optional(),
});

export const deleteBlogPost = createSafeAction(
    {
        allowedRoles: ['admin'],
        inputSchema: DeleteBlogPostSchema,
    },
    async (data: { id: string; slug?: Record<string, string> }): Promise<{ data?: { success: true }; error?: string }> => {
        try {
            const blogRepository = new FirestoreBlogRepository();
            await blogRepository.delete(data.id);

            // Revalidate all blog pages
            revalidatePath('/[lang]/blog', 'page');
            revalidatePath('/[lang]', 'page');

            // Revalidate specific post pages if slug provided
            if (data.slug) {
                Object.entries(data.slug).forEach(([lang, slug]) => {
                    if (slug) {
                        revalidatePath(`/${lang}/blog/${slug}`, 'page');
                    }
                });
            }

            return { data: { success: true } };
        } catch (error: any) {
            console.error('Error deleting blog post:', error);
            return { error: error.message || 'Failed to delete blog post.' };
        }
    }
);
