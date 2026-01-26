
import { BlogPost } from './blog.model';

export interface BlogRepository {
  findById(id: string): Promise<BlogPost | null>;
  findBySlug(slug: string, lang: string): Promise<BlogPost | null>;
  findAll(): Promise<BlogPost[]>;
  save(post: BlogPost): Promise<void>;
  update(post: Partial<BlogPost> & { id: string }): Promise<void>;
  delete(id: string): Promise<void>;
}
