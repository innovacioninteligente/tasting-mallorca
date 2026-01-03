
'use client';

import React, { useEffect } from 'react';
import { notFound, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Locale } from '@/dictionaries/config';
import { BlogPost } from '@/backend/blog/domain/blog.model';
import { Tour } from '@/backend/tours/domain/tour.model';
import { useAlternateLinks } from '@/context/alternate-links-context';
import { BlogPostHeader } from '@/components/blog/blog-post-header';
import { BlogPostBody } from '@/components/blog/blog-post-body';
import { BlogPostShare } from '@/components/blog/blog-post-share';
import { BlogRelatedItems } from '@/components/blog/blog-related-items';
import { DictionaryType } from '@/dictionaries/get-dictionary';


type BlogPostPageProps = {
  post: BlogPost;
  lang: Locale;
  otherPosts: BlogPost[];
  recommendedTours: Tour[];
  dictionary: DictionaryType;
};

export default function BlogPostClientPage({ post, lang, otherPosts, recommendedTours, dictionary }: BlogPostPageProps) {
  const { setAlternateLinks } = useAlternateLinks();
  const pathname = usePathname();

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

  const [fullUrl, setFullUrl] = React.useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFullUrl(`${window.location.origin}${pathname}`);
    }
  }, [pathname]);

  return (
    <article className="bg-background">
      <BlogPostHeader
        title={post.title[lang] || post.title.en}
        author={post.author}
        publishedAt={post.publishedAt}
        image={post.mainImage}
        lang={lang}
      />

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-12 gap-8">
          <aside className="hidden lg:block col-span-1">
            <BlogPostShare title={post.title.en} url={fullUrl} />
          </aside>

          <main className="col-span-12 lg:col-span-8">
            <BlogPostBody content={post.content[lang] || post.content.en} />
          </main>

          <div className="col-span-12 lg:col-span-3">
            {/* Placeholder for potential sidebar content like ads or related links */}
          </div>
        </div>
      </div>

      <BlogRelatedItems
        otherPosts={otherPosts}
        recommendedTours={recommendedTours}
        lang={lang}
        dictionary={dictionary}
      />
    </article>
  );
}
