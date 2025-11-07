'use client';

import Image from 'next/image';
import { Sprout, CalendarDays, MessageCircle } from 'lucide-react';
import { type getDictionary } from '@/dictionaries/get-dictionary';

type BlogSectionProps = {
    dictionary: Awaited<ReturnType<typeof getDictionary>>['blog'];
}

const blogPosts = [
    {
        title: "Living Sustainability: A Day In The Life Atrealar....",
        date: "24 Dec, 2024",
        comments: 2,
        image: 'https://picsum.photos/seed/blog1/400/500',
        imageHint: 'thailand island boat'
    },
    {
        title: "Psychology Is A Broad Field So Consider Narrowing",
        date: "25 Dec, 2024",
        comments: 5,
        image: 'https://picsum.photos/seed/blog2/400/500',
        imageHint: 'moscow cathedral colorful'
    },
    {
        title: "Affordable Therapy Options For The People Need Help",
        date: "26 Dec, 2024",
        comments: 1,
        image: 'https://picsum.photos/seed/blog3/400/500',
        imageHint: 'florence cathedral sunset'
    },
];

export function BlogSection({ dictionary }: BlogSectionProps) {
    return (
        <section className="py-24 bg-background flex flex-col items-center">
            <div className="container text-center mb-12">
                <div className='flex justify-center items-center gap-2'>
                <Sprout className="w-6 h-6 text-primary" />
                <p className="text-primary font-cursive font-bold text-lg">{dictionary.subtitle}</p>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold mt-2">{dictionary.title}</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                {dictionary.description}
                </p>
            </div>
            <div className="w-full px-4 md:px-0 md:w-[90vw] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {blogPosts.map((post, index) => (
                        <div key={index} className="relative rounded-2xl overflow-hidden group h-[500px]">
                            <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint={post.imageHint}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-6 text-white">
                                <h3 className="text-2xl font-bold mb-4">{post.title}</h3>
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="w-4 h-4" />
                                        <span>{post.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="w-4 h-4" />
                                        <span>{post.comments} Comments</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
      </section>
    );
}
