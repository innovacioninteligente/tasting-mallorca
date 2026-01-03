
'use server';

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { findAllBlogPosts, findBlogPostBySlugAndLang } from '@/app/server-actions/blog/findBlogPosts';
import { Locale } from '@/dictionaries/config';
import { BlogPost } from '@/backend/blog/domain/blog.model';
import BlogPostClientPage from './blog-post-client-page';
import { findAllTours } from '@/app/server-actions/tours/findTours';
import { Tour } from '@/backend/tours/domain/tour.model';
import { getDictionary } from '@/dictionaries/get-dictionary';
import { schemaBuilder } from '@/lib/seo/schema-builder';

type BlogPostParams = {
  slug: string;
  lang: Locale;
};

export async function generateStaticParams(): Promise<BlogPostParams[]> {
  const result = await findAllBlogPosts({});
  if (!result.data) {
    return [];
  }

  const paths = result.data
    .filter((post: BlogPost) => post.published)
    .flatMap((post: BlogPost) =>
      Object.entries(post.slug)
        .filter(([_, slugValue]) => slugValue)
        .map(([lang, slug]) => ({
          lang: lang as Locale,
          slug: slug,
        }))
    );

  return paths;
}

export async function generateMetadata({ params }: { params: Promise<BlogPostParams> }): Promise<Metadata> {
  const { lang, slug: encodedSlug } = await params;
  const slug = decodeURIComponent(encodedSlug);
  const postResult = await findBlogPostBySlugAndLang({ slug, lang });

  if (!postResult.data) {
    return { title: 'Post Not Found' };
  }

  const post = postResult.data;
  const title = post.title[lang] || post.title.en;
  const description = post.summary[lang] || post.summary.en;
  const imageUrl = post.mainImage;

  const allSlugs = post.slug;
  const languages: { [key: string]: string } = {};
  if (allSlugs.en) languages['en-US'] = `/en/blog/${allSlugs.en}`;
  if (allSlugs.de) languages['de-DE'] = `/de/blog/${allSlugs.de}`;
  if (allSlugs.fr) languages['fr-FR'] = `/fr/blog/${allSlugs.fr}`;
  if (allSlugs.nl) languages['nl-NL'] = `/nl/blog/${allSlugs.nl}`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      locale: lang,
      type: 'article',
      publishedTime: new Date(post.publishedAt).toISOString(),
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    alternates: {
      canonical: `/${lang}/blog/${slug}`,
      languages,
    },
  };
}

export default async function BlogPostPageLoader({ params }: { params: Promise<BlogPostParams> }) {
  const { lang, slug: encodedSlug } = await params;
  const slug = decodeURIComponent(encodedSlug);

  const [postResult, otherPostsResult, toursResult, dictionary] = await Promise.all([
    findBlogPostBySlugAndLang({ slug, lang }),
    findAllBlogPosts({}),
    findAllTours({}),
    getDictionary(lang),
  ]);

  if (!postResult.data || !postResult.data.published) {
    notFound();
  }

  const otherPosts = (otherPostsResult.data || [])
    .filter(p => p.id !== postResult.data?.id && p.published)
    .slice(0, 3) as BlogPost[];

  const recommendedTours = (toursResult.data || [])
    .filter(t => t.isFeatured && t.published)
    .slice(0, 2) as Tour[];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaBuilder.generateBlogPostSchema(postResult.data, lang))
        }}
      />
      <BlogPostClientPage
        post={postResult.data}
        lang={lang}
        otherPosts={otherPosts}
        recommendedTours={recommendedTours}
        dictionary={dictionary}
      />
    </Suspense>
  );
}

