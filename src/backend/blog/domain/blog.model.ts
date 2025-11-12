
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
