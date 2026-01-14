
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, ImageIcon } from 'lucide-react';
import { BlogPost } from '@/backend/blog/domain/blog.model';
import { Locale } from '@/dictionaries/config';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface HorizontalBlogCardProps {
    post: BlogPost;
    lang: Locale;
}

export function HorizontalBlogCard({ post, lang }: HorizontalBlogCardProps) {
    const slug = post.slug[lang] || post.slug.en;
    const title = post.title[lang] || post.title.en;
    const [isLoading, setIsLoading] = useState(true);

    return (
        <Link
            href={`/${lang}/blog/${slug}`}
            className="block group bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-transparent hover:border-primary/20"
            prefetch={false}
        >
            <div className="flex h-full">
                <div className="relative w-2/5 flex-shrink-0 bg-secondary flex items-center justify-center">
                    {post.mainImage ? (
                        <>
                            {isLoading && <Skeleton className="w-full h-full absolute inset-0" />}
                            <Image
                                src={post.mainImage}
                                alt={title}
                                fill
                                className={`object-cover transition-transform duration-300 group-hover:scale-105 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                                sizes="(max-width: 1023px) 40vw, 20vw"
                                unoptimized
                                onLoad={() => setIsLoading(false)}
                            />
                        </>
                    ) : (
                        <ImageIcon className="w-10 h-10 text-muted" />
                    )}
                </div>
                <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(post.publishedAt), "PPP")}</span>
                        </div>
                        <h3 className="text-lg font-bold leading-tight mb-2">{title}</h3>
                    </div>
                    <div className="flex justify-end items-center mt-3">
                        <div className="rounded-full bg-primary/10 text-primary h-8 w-8 flex items-center justify-center group-hover:bg-primary/20">
                            <ArrowRight className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
