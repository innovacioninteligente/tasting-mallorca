
'use client';

import { format } from 'date-fns';
import { es, fr, de, nl } from 'date-fns/locale';
import { Calendar, User } from 'lucide-react';
import { Locale } from '@/dictionaries/config';

interface BlogPostHeaderProps {
    title: string;
    author: string;
    publishedAt: Date | string;
    lang: Locale;
}

const locales: { [key: string]: typeof es } = { es, fr, de, nl, en: es };

export function BlogPostHeader({ title, author, publishedAt, lang }: BlogPostHeaderProps) {
    const locale = locales[lang] || es;
    const date = new Date(publishedAt);

    return (
        <header className="py-16 bg-secondary/50">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold text-foreground">
                    {title}
                </h1>
                <div className="flex items-center justify-center gap-6 mt-8 text-muted-foreground">
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
        </header>
    );
}
