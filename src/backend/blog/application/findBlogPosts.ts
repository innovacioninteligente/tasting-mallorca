
import { BlogPost } from '../domain/blog.model';
import { BlogRepository } from '../domain/blog.repository';

export async function findBlogPostById(
  blogRepository: BlogRepository,
  id: string
): Promise<BlogPost | null> {
  return blogRepository.findById(id);
}

export async function findBlogPostBySlug(
  blogRepository: BlogRepository,
  slug: string,
  lang: string
): Promise<BlogPost | null> {
    return blogRepository.findBySlug(slug, lang);
}

export async function findAllBlogPosts(
  blogRepository: BlogRepository
): Promise<BlogPost[]> {
  return blogRepository.findAll();
}
