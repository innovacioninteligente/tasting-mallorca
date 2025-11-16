
import React from 'react';
import { notFound } from 'next/navigation';
import { Locale } from '@/dictionaries/config';
import { Metadata } from 'next';
import { findAllBlogPosts, findBlogPostBySlugAndLang } from '@/app/server-actions/blog/findBlogPosts';
import { BlogPost } from '@/backend/blog/domain/blog.model';
import BlogPostPage from './page';

type BlogPostPageWrapperProps = {
  params: {
    slug: string;
    lang: Locale;
  };
};

export async function generateStaticParams(): Promise<BlogPostPageWrapperProps['params'][]> {
  const result = await findAllBlogPosts({});
  if (!result.data) {
    return [];
  }

  const paths = result.data.flatMap((post: BlogPost) =>
    Object.entries(post.slug)
      .filter(([_, slugValue]) => slugValue && post.published) 
      .map(([lang, slug]) => ({
        lang: lang as Locale,
        slug: encodeURIComponent(slug),
      }))
  );

  return paths;
}

export async function generateMetadata({ params }: BlogPostPageWrapperProps): Promise<Metadata> {
  const { lang, slug: encodedSlug } = params;
  const slug = decodeURIComponent(encodedSlug);
  const postResult = await findBlogPostBySlugAndLang({ slug, lang });

  if (!postResult.data) {
    return {
      title: 'Post Not Found',
    };
  }

  const post = postResult.data;
  const title = post.title[lang] || post.title.en;
  const description = post.summary[lang] || post.summary.en;
  const imageUrl = post.mainImage;
  
  const allSlugs = post.slug;
  const languages: { [key: string]: string } = {};
  if (allSlugs.en) languages['en-US'] = `/en/blog/${encodeURIComponent(allSlugs.en)}`;
  if (allSlugs.de) languages['de-DE'] = `/de/blog/${encodeURIComponent(allSlugs.de)}`;
  if (allSlugs.fr) languages['fr-FR'] = `/fr/blog/${encodeURIComponent(allSlugs.fr)}`;
  if (allSlugs.nl) languages['nl-NL'] = `/nl/blog/${encodeURIComponent(allSlugs.nl)}`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: lang,
      type: 'article',
      publishedTime: new Date(post.publishedAt).toISOString(),
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    alternates: {
      canonical: `/${lang}/blog/${slug}`,
      languages,
    },
  };
}

export default async function BlogPostPageWrapper({ params }: BlogPostPageWrapperProps) {
  const { lang, slug: encodedSlug } = params;
  const slug = decodeURIComponent(encodedSlug);
  
  const postResult = await findBlogPostBySlugAndLang({ slug, lang });

  if (!postResult.data) {
    notFound();
  }
  
  return <BlogPostPage post={postResult.data} lang={lang} />;
}
