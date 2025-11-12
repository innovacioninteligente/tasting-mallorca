
import { BlogPost } from '../domain/blog.model';
import { BlogRepository } from '../domain/blog.repository';

export async function createBlogPost(
  blogRepository: BlogRepository,
  blogData: BlogPost
): Promise<string> {
  await blogRepository.save(blogData);
  return blogData.id;
}
