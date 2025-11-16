
'use client';

import React, { useEffect } from 'react';
import { notFound } from 'next/navigation';
import { Locale } from '@/dictionaries/config';
import { BlogPost } from '@/backend/blog/domain/blog.model';
import { BlogPostHeader } from '@/components/blog/blog-post-header';
import { BlogPostBody } from '@/components/blog/blog-post-body';
import Image from 'next/image';
import { useAlternateLinks } from '@/context/alternate-links-context';

type BlogPostPageProps = {
  post: BlogPost;
  lang: Locale;
};

export default function BlogPostPage({ post, lang }: BlogPostPageProps) {
  const { setAlternateLinks } = useAlternateLinks();

  useEffect(() => {
    if (post) {
      const allSlugs = post.slug;
      const languages: { [key: string]: string } = {};
      if (allSlugs.en) languages['en'] = `/en/blog/${allSlugs.en}`;
      if (allSlugs.de) languages['de'] = `/de/blog/${allSlugs.de}`;
      if (allSlugs.fr) languages['fr'] = `/fr/blog/${allSlugs.fr}`;
      if (allSlugs.nl) languages['nl'] = `/nl/blog/${allSlugs.nl}`;
      setAlternateLinks(languages);
    }

    // Cleanup function to reset links when component unmounts
    return () => setAlternateLinks({});
  }, [post, setAlternateLinks, lang]);
  
  if (!post) {
    notFound();
  }
  
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
                sizes="100vw"
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

// Add the data fetching and metadata generation functions at the top level
import { Metadata } from 'next';
import { findAllBlogPosts, findBlogPostBySlugAndLang } from '@/app/server-actions/blog/findBlogPosts';

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

export async function generateMetadata({ params }: { params: BlogPostParams }): Promise<Metadata> {
  const { lang, slug: encodedSlug } = params;
  const slug = decodeURIComponent(encodedSlug);
  const postResult = await findBlogPostBySlugAndLang(slug, lang);

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

export async function BlogPostPageLoader({ params }: { params: BlogPostParams }) {
    const { lang, slug: encodedSlug } = params;
    const slug = decodeURIComponent(encodedSlug);
    const postResult = await findBlogPostBySlugAndLang(slug, lang);

    if (!postResult.data || !postResult.data.published) {
        notFound();
    }
    
    return <BlogPostPage post={postResult.data} lang={lang} />;
}
