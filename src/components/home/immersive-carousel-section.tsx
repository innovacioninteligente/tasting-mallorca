'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const hikerImage = PlaceHolderImages.find(img => img.id === 'hiker-with-backpack');
const travelGirlImage = PlaceHolderImages.find(img => img.id === 'girl-travel-view');
const testimonialAvatar2 = PlaceHolderImages.find(img => img.id === 'testimonial-avatar-2');
const heroImage3 = PlaceHolderImages.find(img => img.id === 'hero-image-3');

const immersiveCarouselImages = [
    hikerImage,
    travelGirlImage,
    testimonialAvatar2,
    heroImage3,
].filter(Boolean) as (typeof PlaceHolderImages[0])[];

export function ImmersiveCarouselSection() {
    const immersiveAutoplayPlugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }))
    const carouselContainerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: carouselContainerRef,
        offset: ['start end', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], ['-50%', '50%']);

    return (
        <section ref={carouselContainerRef} className='w-full min-h-screen overflow-hidden'>
            <motion.div style={{ y }} className="h-full">
                <Carousel
                    plugins={[immersiveAutoplayPlugin.current]}
                    className="w-full h-full"
                    opts={{
                        loop: true,
                    }}
                >
                    <CarouselContent className='h-screen'>
                        {immersiveCarouselImages.map((img) => (
                            <CarouselItem key={img.id} className='h-full relative'>
                                <Image
                                    src={img.imageUrl}
                                    alt={img.description}
                                    fill
                                    className="object-cover"
                                    data-ai-hint={img.imageHint}
                                />
                                <div className="absolute inset-0 bg-black/20"></div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </motion.div>
        </section>
    );
}
