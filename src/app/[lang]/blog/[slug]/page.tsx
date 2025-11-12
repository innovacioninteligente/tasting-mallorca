
import React from 'react';
import { notFound } from 'next/navigation';
import { Locale } from '@/dictionaries/config';
import { Metadata } from 'next';
import { findAllBlogPosts, findBlogPostBySlugAndLang } from '@/app/server-actions/blog/findBlogPosts';
import { BlogPost } from '@/backend/blog/domain/blog.model';
import { BlogPostHeader } from '@/components/blog/blog-post-header';
import { BlogPostBody } from '@/components/blog/blog-post-body';
import Image from 'next/image';

type BlogPostPageProps = {
  params: {
    slug: string;
    lang: Locale;
  };
};

export async function generateStaticParams(): Promise<BlogPostPageProps['params'][]> {
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

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
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

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: post.mainImage,
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
      images: [post.mainImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { lang, slug: encodedSlug } = params;
  const slug = decodeURIComponent(encodedSlug);
  
  const postResult = await findBlogPostBySlugAndLang({ slug, lang });

  if (!postResult.data) {
    notFound();
  }
  const post = postResult.data;
  
  return (
    <article className="bg-background">
        <BlogPostHeader 
            title={post.title[lang] || post.title.en}
            author={post.author}
            publishedAt={post.publishedAt}
            lang={lang}
        />
        
        <div className="w-full h-[40vh] md:h-[60vh] relative">
            <Image
                src={post.mainImage}
                alt={post.title[lang] || post.title.en}
                fill
                className="object-cover"
                priority
            />
             <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <main className="w-full md:w-[70vw] lg:w-[60vw] xl:w-[50vw] mx-auto px-4 py-16">
            <BlogPostBody content={post.content[lang] || post.content.en} />
        </main>
    </article>
  );
}
