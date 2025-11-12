
import { BlogPost } from '../domain/blog.model';
import { BlogRepository } from '../domain/blog.repository';

export async function updateBlogPost(
  blogRepository: BlogRepository,
  blogData: Partial<BlogPost> & { id: string }
): Promise<void> {
  await blogRepository.update(blogData);
}
