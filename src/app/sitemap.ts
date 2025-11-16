
import { MetadataRoute } from 'next';
import { i18n } from '@/dictionaries/config';
import { findAllTours } from './server-actions/tours/findTours';
import { findAllBlogPosts } from './server-actions/blog/findBlogPosts';
import { Tour } from '@/backend/tours/domain/tour.model';
import { BlogPost } from '@/backend/blog/domain/blog.model';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // 1. Static Pages
  const staticPages = [
    '', // Home
    '/about',
    '/contact',
    '/tours',
    '/blog',
    '/private-tours-mallorca',
    '/guest-feedback',
    '/road-map',
    '/manage-booking',
    '/signin',
    '/signup'
  ];

  const staticUrls = staticPages.flatMap(page => 
    i18n.locales.map(locale => ({
      url: `${siteUrl}/${locale}${page}`,
      lastModified: new Date(),
    }))
  );

  // 2. Dynamic Tour Pages
  const toursResult = await findAllTours({});
  const tours = (toursResult.data || []).filter(tour => tour.published) as Tour[];

  const tourUrls = tours.flatMap(tour =>
    Object.entries(tour.slug)
      .filter(([_, slugValue]) => slugValue)
      .map(([lang, slug]) => ({
        url: `${siteUrl}/${lang}/tours/${slug}`,
        lastModified: new Date(), // Ideally, you'd use a 'lastUpdated' field from your data
      }))
  );

  // 3. Dynamic Blog Pages
  const blogPostsResult = await findAllBlogPosts({});
  const blogPosts = (blogPostsResult.data || []).filter(post => post.published) as BlogPost[];
  
  const blogUrls = blogPosts.flatMap(post =>
    Object.entries(post.slug)
      .filter(([_, slugValue]) => slugValue)
      .map(([lang, slug]) => ({
        url: `${siteUrl}/${lang}/blog/${slug}`,
        lastModified: post.publishedAt || new Date(),
      }))
  );

  return [...staticUrls, ...tourUrls, ...blogUrls];
}
