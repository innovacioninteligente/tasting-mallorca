
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
      if (allSlugs.en) languages['en'] = `/en/blog/${encodeURIComponent(allSlugs.en)}`;
      if (allSlugs.de) languages['de'] = `/de/blog/${encodeURIComponent(allSlugs.de)}`;
      if (allSlugs.fr) languages['fr'] = `/fr/blog/${encodeURIComponent(allSlugs.fr)}`;
      if (allSlugs.nl) languages['nl'] = `/nl/blog/${encodeURIComponent(allSlugs.nl)}`;
      setAlternateLinks(languages);
    }

    // Cleanup function to reset links when component unmounts
    return () => setAlternateLinks({});
  }, [post, setAlternateLinks]);
  
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
