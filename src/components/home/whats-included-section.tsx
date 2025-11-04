'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bus, Users, UtensilsCrossed, Mountain, Landmark, CheckCircle } from 'lucide-react';
import { type getDictionary } from '@/dictionaries/get-dictionary';

const whatsIncludedImage = PlaceHolderImages.find(img => img.id === 'whats-included-picnic');

type WhatsIncludedDictionary = Awaited<ReturnType<typeof getDictionary>>['whatsIncluded'];

export function WhatsIncludedSection({ dictionary }: { dictionary: WhatsIncludedDictionary }) {
    
    const includedItems = [
        {
            icon: <Bus className="w-7 h-7" />,
            title: dictionary.pickup.title,
            description: dictionary.pickup.description,
        },
        {
            icon: <Users className="w-7 h-7" />,
            title: dictionary.guides.title,
            description: dictionary.guides.description,
        },
        {
            icon: <UtensilsCrossed className="w-7 h-7" /> ,
            title: dictionary.lunch.title,
            description: dictionary.lunch.description,
        },
        {
            icon: <Mountain className="w-7 h-7" />,
            title: dictionary.landscapes.title,
            description: dictionary.landscapes.description,
        },
        {
            icon: <Landmark className="w-7 h-7" />,
            title: dictionary.sites.title,
            description: dictionary.sites.description,
        },
    ];

    return (
        <section className="py-24 bg-background overflow-hidden">
            <div className="container mx-auto w-full md:w-[90vw] px-4 md:px-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Content */}
                    <div className="md:pl-8">
                        <p className="text-primary font-cursive font-bold text-lg">{dictionary.subtitle}</p>
                        <h2 className="text-4xl md:text-5xl font-extrabold mt-2">{dictionary.title}</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-xl">
                           {dictionary.description}
                        </p>

                        <div className="mt-10 space-y-8">
                            {includedItems.map((item, index) => (
                                <div key={index} className="flex items-start gap-6">
                                    <div className="flex-shrink-0 w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">{item.title}</h3>
                                        <p className="mt-2 text-muted-foreground">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Right Side - Image */}
                    <div className="relative order-first md:order-last">
                    {whatsIncludedImage && (
                        <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl max-w-md mx-auto">
                        <Image
                            src={whatsIncludedImage.imageUrl}
                            alt={whatsIncludedImage.description}
                            fill
                            className="object-cover"
                            data-ai-hint={whatsIncludedImage.imageHint}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                    )}
                        <div className="absolute bottom-8 -right-8 h-20 w-20 bg-primary rounded-full flex items-center justify-center transform transition-transform duration-300 hover:scale-110 cursor-pointer">
                            <CheckCircle className="h-10 w-10 text-primary-foreground" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
