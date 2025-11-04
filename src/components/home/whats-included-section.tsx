'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bus, Users, UtensilsCrossed, Mountain, Landmark } from 'lucide-react';
import { type getDictionary } from '@/dictionaries/get-dictionary';
import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

type WhatsIncludedDictionary = Awaited<ReturnType<typeof getDictionary>>['whatsIncluded'];

const includedItemsData = [
    {
        id: 'pickup',
        icon: <Bus className="w-7 h-7" />,
        image: PlaceHolderImages.find(img => img.id === 'included-pickup'),
    },
    {
        id: 'guides',
        icon: <Users className="w-7 h-7" />,
        image: PlaceHolderImages.find(img => img.id === 'included-guide'),
    },
    {
        id: 'lunch',
        icon: <UtensilsCrossed className="w-7 h-7" /> ,
        image: PlaceHolderImages.find(img => img.id === 'included-lunch'),
    },
    {
        id: 'landscapes',
        icon: <Mountain className="w-7 h-7" />,
        image: PlaceHolderImages.find(img => img.id === 'included-landscape'),
    },
    {
        id: 'sites',
        icon: <Landmark className="w-7 h-7" />,
        image: PlaceHolderImages.find(img => img.id === 'included-sites'),
    },
];

const IncludedItemContent = ({
    id,
    icon,
    dictionary,
    onInView
}: {
    id: string;
    icon: React.ReactNode;
    dictionary: any;
    onInView: (id: string) => void;
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });

    React.useEffect(() => {
        if (isInView) {
            onInView(id);
        }
    }, [isInView, id, onInView]);

    const itemImage = includedItemsData.find(p => p.id === id)?.image;

    return (
        <div ref={ref} className="flex items-center min-h-[60vh] py-12 md:py-0">
             <div>
                {itemImage && (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6 md:hidden shadow-lg">
                        <Image
                            src={itemImage.imageUrl}
                            alt={dictionary.title}
                            fill
                            className="object-cover"
                            data-ai-hint={itemImage.imageHint}
                        />
                    </div>
                )}
                <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">{dictionary.title}</h3>
                        <p className="mt-2 text-muted-foreground">
                            {dictionary.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export function WhatsIncludedSection({ dictionary }: { dictionary: WhatsIncludedDictionary }) {
    const [activeIndex, setActiveIndex] = useState(includedItemsData[0].id);

    const items = [
        { id: 'pickup', dictionary: dictionary.pickup, icon: <Bus className="w-7 h-7" /> },
        { id: 'guides', dictionary: dictionary.guides, icon: <Users className="w-7 h-7" /> },
        { id: 'lunch', dictionary: dictionary.lunch, icon: <UtensilsCrossed className="w-7 h-7" /> },
        { id: 'landscapes', dictionary: dictionary.landscapes, icon: <Mountain className="w-7 h-7" /> },
        { id: 'sites', dictionary: dictionary.sites, icon: <Landmark className="w-7 h-7" /> },
    ];
    
    return (
        <section className="py-24 bg-background overflow-hidden">
             <div className="container mx-auto w-full md:w-[90vw] px-4 md:px-0">
                <div className="max-w-xl mb-16">
                    <p className="text-primary font-cursive font-bold text-lg">{dictionary.subtitle}</p>
                    <h2 className="text-4xl md:text-5xl font-extrabold mt-2">{dictionary.title}</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                       {dictionary.description}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    {/* Left Scrolling Column */}
                    <div className="w-full">
                        {items.map((item) => (
                           <IncludedItemContent 
                             key={item.id}
                             id={item.id}
                             icon={item.icon}
                             dictionary={item.dictionary}
                             onInView={setActiveIndex}
                           />
                        ))}
                    </div>

                    {/* Right Sticky Column */}
                    <div className="w-full h-screen sticky top-0 hidden md:flex items-center">
                        <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                             {includedItemsData.map(item => (
                                item.image && (
                                    <motion.div
                                        key={item.id}
                                        initial={false}
                                        animate={{
                                            opacity: activeIndex === item.id ? 1 : 0,
                                        }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                        className="absolute inset-0"
                                    >
                                        <Image
                                            src={item.image.imageUrl}
                                            alt={item.image.description}
                                            fill
                                            className="object-cover"
                                            data-ai-hint={item.image.imageHint}
                                        />
                                    </motion.div>
                                )
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}