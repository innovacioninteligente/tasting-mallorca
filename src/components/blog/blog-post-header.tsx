
'use client';

import { format } from 'date-fns';
import { es, fr, de, nl } from 'date-fns/locale';
import { Calendar, User } from 'lucide-react';
import { Locale } from '@/dictionaries/config';
import Image from 'next/image';

interface BlogPostHeaderProps {
    title: string;
    author: string;
    publishedAt: Date | string;
    image: string;
    lang: Locale;
}

const locales: { [key: string]: typeof es } = { es, fr, de, nl, en: es };

export function BlogPostHeader({ title, author, publishedAt, image, lang }: BlogPostHeaderProps) {
    const locale = locales[lang] || es;
    const date = new Date(publishedAt);

    return (
        <header className="relative w-full h-screen">
            <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
            />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="text-center text-white bg-black/20 backdrop-blur-[7px] p-8 rounded-2xl border border-white/20 w-full md:max-w-[60vw]">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white">
                        {title}
                    </h1>
                    <div className="flex items-center justify-center flex-wrap gap-4 md:gap-6 mt-6 text-white/80">
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            <span className="font-medium">{author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            <time dateTime={date.toISOString()}>
                                {format(date, 'PPP', { locale })}
                            </time>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
