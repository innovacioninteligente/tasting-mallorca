
import { z } from 'zod';

export interface BlogPost {
  id: string;
  slug: { [key: string]: string };
  title: { [key: string]: string };
  summary: { [key: string]: string };
  content: { [key: string]: string };
  mainImage: string;
  author: string;
  published: boolean;
  isFeatured: boolean;
  publishedAt: Date;
}


const multilingualStringSchema = z.object({
  en: z.string().min(1, { message: "English text is required." }),
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
  author: z.string().min(1, "Author is required."),
  isFeatured: z.boolean().default(false),
  published: z.boolean().default(false),
  mainImage: z.string().min(1, "Main image is required."),
  publishedAt: z.date({ required_error: "Publication date is required." }),
});

export type CreateBlogPostInput = z.infer<typeof CreateBlogPostInputSchema>;
export const UpdateBlogPostInputSchema = CreateBlogPostInputSchema.partial().extend({ id: z.string() });
