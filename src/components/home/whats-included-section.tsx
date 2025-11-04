'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bus, Users, UtensilsCrossed, Mountain, Landmark } from 'lucide-react';
import { type getDictionary } from '@/dictionaries/get-dictionary';
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';

type WhatsIncludedDictionary = Awaited<ReturnType<typeof getDictionary>>['whatsIncluded'];

const imageMap = {
    pickup: PlaceHolderImages.find(img => img.id === 'included-pickup'),
    guides: PlaceHolderImages.find(img => img.id === 'included-guide'),
    lunch: PlaceHolderImages.find(img => img.id === 'included-lunch'),
    landscapes: PlaceHolderImages.find(img => img.id === 'included-landscape'),
    sites: PlaceHolderImages.find(img => img.id === 'included-sites'),
};

export function WhatsIncludedSection({ dictionary }: { dictionary: WhatsIncludedDictionary }) {
    
    const includedItems = [
        {
            id: 'pickup',
            icon: <Bus className="w-7 h-7" />,
            title: dictionary.pickup.title,
            description: dictionary.pickup.description,
            image: imageMap.pickup
        },
        {
            id: 'guides',
            icon: <Users className="w-7 h-7" />,
            title: dictionary.guides.title,
            description: dictionary.guides.description,
            image: imageMap.guides
        },
        {
            id: 'lunch',
            icon: <UtensilsCrossed className="w-7 h-7" /> ,
            title: dictionary.lunch.title,
            description: dictionary.lunch.description,
            image: imageMap.lunch
        },
        {
            id: 'landscapes',
            icon: <Mountain className="w-7 h-7" />,
            title: dictionary.landscapes.title,
            description: dictionary.landscapes.description,
            image: imageMap.landscapes
        },
        {
            id: 'sites',
            icon: <Landmark className="w-7 h-7" />,
            title: dictionary.sites.title,
            description: dictionary.sites.description,
            image: imageMap.sites
        },
    ];

    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start center', 'end center']
    });

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        return scrollYProgress.on("change", (latest) => {
            const newIndex = Math.min(Math.floor(latest * includedItems.length), includedItems.length - 1);
            if (newIndex !== activeIndex) {
                setActiveIndex(newIndex);
            }
        });
    }, [scrollYProgress, includedItems.length, activeIndex]);
    
    return (
        <section ref={sectionRef} className="py-24 bg-background overflow-hidden relative">
            <div className="container mx-auto w-full md:w-[90vw] px-4 md:px-0">
                <div className="md:grid md:grid-cols-2 md:gap-16 items-start">
                    {/* Left Side - Content */}
                    <div className="md:py-8">
                        <div className="max-w-xl mb-12">
                            <p className="text-primary font-cursive font-bold text-lg">{dictionary.subtitle}</p>
                            <h2 className="text-4xl md:text-5xl font-extrabold mt-2">{dictionary.title}</h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                               {dictionary.description}
                            </p>
                        </div>
                        <div className="space-y-24">
                            {includedItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    className="flex items-start gap-6"
                                    style={{ opacity: activeIndex === index ? 1 : 0.3 }}
                                >
                                    <div className="flex-shrink-0 w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">{item.title}</h3>
                                        <p className="mt-2 text-muted-foreground">
                                            {item.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Right Side - Sticky Image */}
                    <div className="hidden md:block sticky top-24 h-[calc(100vh-6rem)]">
                        <div className="relative w-full h-full">
                            {includedItems.map((item, index) => (
                                item.image && (
                                    <motion.div
                                        key={item.id}
                                        className="absolute inset-0"
                                        animate={{ opacity: activeIndex === index ? 1 : 0 }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                    >
                                        <Image
                                            src={item.image.imageUrl}
                                            alt={item.image.description}
                                            fill
                                            className="object-cover rounded-3xl"
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