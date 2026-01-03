
'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bus, Users, UtensilsCrossed, Mountain, Landmark, ShieldCheck } from 'lucide-react';
import { type getDictionary } from '@/dictionaries/get-dictionary';
import { SectionBadge } from '@/components/ui/section-badge';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

type WhatsIncludedDictionary = Awaited<ReturnType<typeof getDictionary>>['whatsIncluded'];

const includedItemsData = [
    {
        id: 'pickup',
        icon: <Bus className="w-14 h-14" />,
        image: PlaceHolderImages.find(img => img.id === 'included-pickup'),
    },
    {
        id: 'guides',
        icon: <Users className="w-14 h-14" />,
        image: PlaceHolderImages.find(img => img.id === 'included-guide'),
    },
    {
        id: 'lunch',
        icon: <UtensilsCrossed className="w-14 h-14" />,
        image: PlaceHolderImages.find(img => img.id === 'included-lunch'),
    },
    {
        id: 'landscapes',
        icon: <Mountain className="w-14 h-14" />,
        image: PlaceHolderImages.find(img => img.id === 'included-landscape'),
    },
    {
        id: 'sites',
        icon: <Landmark className="w-14 h-14" />,
        image: PlaceHolderImages.find(img => img.id === 'included-sites'),
    },
];

export function WhatsIncludedSection({ dictionary }: { dictionary: WhatsIncludedDictionary }) {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start center", "end end"]
    });

    const items = [
        { id: 'pickup', dictionary: dictionary.pickup, icon: <Bus className="w-14 h-14 text-accent" /> },
        { id: 'guides', dictionary: dictionary.guides, icon: <Users className="w-14 h-14 text-accent" /> },
        { id: 'lunch', dictionary: dictionary.lunch, icon: <UtensilsCrossed className="w-14 h-14 text-accent" /> },
        { id: 'landscapes', dictionary: dictionary.landscapes, icon: <Mountain className="w-14 h-14 text-accent" /> },
        { id: 'sites', dictionary: dictionary.sites, icon: <Landmark className="w-14 h-14 text-accent" /> },
    ];

    const activeIndex = useTransform(scrollYProgress, (pos) => {
        return Math.floor(pos * items.length);
    });

    return (
        <section ref={sectionRef} className="py-24 bg-background">
            <div className="container mx-auto w-full md:w-[80vw] px-4 md:px-0">
                <div className="max-w-xl mb-16">
                    <SectionBadge className="mb-4">
                        <ShieldCheck className="w-5 h-5" />
                        {dictionary.subtitle}
                    </SectionBadge>
                    <h2 className="text-4xl md:text-5xl font-extrabold mt-2 text-foreground">{dictionary.title}</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        {dictionary.description}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    {/* Left Scrolling Column */}
                    <div className="w-full">
                        {items.map((item) => (
                            <div key={item.id} className="flex flex-col items-start gap-4 mb-16">
                                <div className="flex-shrink-0 w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">{item.dictionary.title}</h3>
                                    <p className="mt-2 text-muted-foreground">
                                        {item.dictionary.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Sticky Column */}
                    <div className="w-full h-[calc(100vh-6rem)] sticky top-24 hidden md:flex items-center">
                        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                            {includedItemsData.map((item, index) => {
                                const opacity = useTransform(activeIndex, (latest) => {
                                    const isLastItem = index === items.length - 1;
                                    const isActive = latest === index;
                                    const isPastLast = isLastItem && latest >= items.length;
                                    return isActive || isPastLast ? 1 : 0;
                                });

                                return item.image && (
                                    <motion.div
                                        key={item.id}
                                        style={{ opacity }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                        className="absolute inset-0"
                                    >
                                        <Image
                                            src={item.image.imageUrl}
                                            alt={item.image.description}
                                            fill
                                            className="object-cover"
                                            sizes="50vw"
                                            data-ai-hint={item.image.imageHint}
                                        />
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
