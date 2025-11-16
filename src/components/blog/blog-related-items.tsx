
'use client';

import { BlogPost } from "@/backend/blog/domain/blog.model";
import { Tour } from "@/backend/tours/domain/tour.model";
import { Locale } from "@/dictionaries/config";
import { BlogCard } from "../blog-card";
import { HorizontalTourCard } from "../tours/horizontal-tour-card";
import { DictionaryType } from "@/dictionaries/get-dictionary";


interface BlogRelatedItemsProps {
    otherPosts: BlogPost[];
    recommendedTours: Tour[];
    lang: Locale;
    dictionary: DictionaryType;
}

export function BlogRelatedItems({ otherPosts, recommendedTours, lang, dictionary }: BlogRelatedItemsProps) {
    return (
        <section className="bg-secondary/50 py-16">
            <div className="container mx-auto px-4">
                {recommendedTours.length > 0 && (
                    <div className="mb-16">
                         <h2 className="text-3xl font-bold mb-8 text-center">Tours you might like</h2>
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {recommendedTours.map(tour => (
                                <HorizontalTourCard key={tour.id} tour={tour} lang={lang} />
                            ))}
                        </div>
                    </div>
                )}
                
                {otherPosts.length > 0 && (
                    <div>
                        <h2 className="text-3xl font-bold mb-8 text-center">Keep reading</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {otherPosts.map(post => (
                                <BlogCard key={post.id} post={post} lang={lang} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

