
'use client';

import { type getDictionary } from '@/dictionaries/get-dictionary';
import { Sprout } from 'lucide-react';
import { BlogPost } from '@/backend/blog/domain/blog.model';
import { Locale } from '@/dictionaries/config';
import { BlogCard } from '../blog-card';

type BlogSectionProps = {
    dictionary: Awaited<ReturnType<typeof getDictionary>>['blog'];
    posts: BlogPost[];
    lang: Locale;
}

export function BlogSection({ dictionary, posts, lang }: BlogSectionProps) {

    if (!posts || posts.length === 0) {
        return null;
    }

    return (
        <section className="py-24 bg-background flex flex-col items-center">
            <div className="container text-center mb-12">
                <div className='flex justify-center items-center gap-2'>
                <Sprout className="w-6 h-6 text-accent" />
                <p className="text-accent font-cursive font-bold text-lg">{dictionary.subtitle}</p>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold mt-2">{dictionary.title}</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                {dictionary.description}
                </p>
            </div>
            <div className="w-full px-4 md:px-0 md:w-[80vw] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <BlogCard key={post.id} post={post} lang={lang} />
                    ))}
                </div>
            </div>
      </section>
    );
}
