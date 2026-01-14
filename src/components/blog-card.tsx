
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, ImageIcon } from 'lucide-react';
import { BlogPost } from '@/backend/blog/domain/blog.model';
import { Locale } from '@/dictionaries/config';
import { format } from 'date-fns';

interface BlogCardProps {
    post: BlogPost;
    lang: Locale;
}

export function BlogCard({ post, lang }: BlogCardProps) {
    const slug = post.slug[lang] || post.slug.en;
    const title = post.title[lang] || post.title.en;
    const summary = post.summary[lang] || post.summary.en;

    return (
        <Link
            href={`/${lang}/blog/${slug}`}
            className="block group"
            prefetch={false}
        >
            <div className="bg-card rounded-2xl overflow-hidden shadow-lg h-full flex flex-col cursor-pointer">
                <div className="relative h-64 bg-secondary flex items-center justify-center">
                    {post.mainImage ? (
                        <Image
                            src={post.mainImage}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            unoptimized
                        />
                    ) : (
                        <ImageIcon className="w-16 h-16 text-muted" />
                    )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(post.publishedAt), "PPP")}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-grow">{summary}</p>
                    <div className="flex justify-between items-center mt-auto">
                        <span className="text-primary font-semibold text-sm">Leer más</span>
                        <div className="rounded-full bg-primary/10 text-primary h-10 w-10 flex items-center justify-center group-hover:bg-primary/20">
                            <ArrowRight className="h-5 w-5" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
