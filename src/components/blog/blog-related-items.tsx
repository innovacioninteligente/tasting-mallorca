
'use client';

import { BlogPost } from "@/backend/blog/domain/blog.model";
import { Tour } from "@/backend/tours/domain/tour.model";
import { Locale } from "@/dictionaries/config";
import { HorizontalTourCard } from "../tours/horizontal-tour-card";
import { DictionaryType } from "@/dictionaries/get-dictionary";
import { HorizontalBlogCard } from "./horizontal-blog-card";


interface BlogRelatedItemsProps {
    otherPosts: BlogPost[];
    recommendedTours: Tour[];
    lang: Locale;
    dictionary: DictionaryType;
}

export function BlogRelatedItems({ otherPosts, recommendedTours, lang, dictionary }: BlogRelatedItemsProps) {
    const t = dictionary.blog.related;
    
    return (
        <section className="bg-secondary/50 py-16">
            <div className="container mx-auto px-4 md:w-[80vw]">
                {recommendedTours.length > 0 && (
                    <div className="mb-16">
                         <h2 className="text-3xl font-bold mb-8 text-center">{t.toursTitle}</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {recommendedTours.map(tour => (
                                <HorizontalTourCard key={tour.id} tour={tour} lang={lang} />
                            ))}
                        </div>
                    </div>
                )}
                
                {otherPosts.length > 0 && (
                    <div>
                        <h2 className="text-3xl font-bold mb-8 text-center">{t.postsTitle}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {otherPosts.map(post => (
                                <HorizontalBlogCard key={post.id} post={post} lang={lang} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
