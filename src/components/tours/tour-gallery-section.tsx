
'use client';

import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from 'react';
import { Tour } from '@/backend/tours/domain/tour.model';

const images = [
    { src: 'https://picsum.photos/seed/tour-gallery1/800/600', alt: 'Scenic view of Valldemossa', hint: 'valldemossa aerial view' },
    { src: 'https://picsum.photos/seed/tour-gallery2/800/600', alt: 'Couple walking in a charming street', hint: 'couple walking old town' },
    { src: 'https://picsum.photos/seed/tour-gallery3/800/600', alt: 'Narrow cobblestone street in a village', hint: 'cobblestone street mallorca' },
    { src: 'https://picsum.photos/seed/tour-gallery4/800/600', alt: 'View of the coast from a viewpoint', hint: 'mallorca coast viewpoint' },
    { src: 'https://picsum.photos/seed/tour-gallery5/800/600', alt: 'Extra view for carousel', hint: 'mallorca extra view' },
];

export function TourGallerySection() {
    const autoplayPlugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
    
    // In a real scenario, you'd pass the tour's gallery images here.
    // For now, we'll continue using the placeholder images.

    return (
        <div className="w-full md:w-[90vw] mx-auto px-4 mt-8">
            {/* Mobile Carousel View */}
            <div className="md:hidden">
                <Carousel
                    plugins={[autoplayPlugin.current]}
                    className="w-full"
                    opts={{ loop: true }}
                    onMouseEnter={autoplayPlugin.current.stop}
                    onMouseLeave={autoplayPlugin.current.reset}
                >
                    <CarouselContent>
                        {images.map((image, index) => (
                            <CarouselItem key={index}>
                                <div className="aspect-video relative rounded-lg overflow-hidden">
                                     <Image
                                        src={image.src}
                                        alt={image.alt}
                                        fill
                                        className="object-cover w-full h-full"
                                        data-ai-hint={image.hint}
                                        priority={index === 0}
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 border-white/50 h-10 w-10" />
                    <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 border-white/50 h-10 w-10" />
                </Carousel>
            </div>

            {/* Desktop Grid View */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 h-[50vh]">
                {/* Main Image */}
                <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 relative rounded-lg overflow-hidden">
                    <Image
                        src={images[0].src}
                        alt={images[0].alt}
                        fill
                        className="object-cover w-full h-full view-transition"
                        data-ai-hint={images[0].hint}
                        priority
                        style={{ viewTransitionName: `tour-image-main` } as React.CSSProperties}
                    />
                </div>

                {/* Smaller Images */}
                <div className="relative rounded-lg overflow-hidden">
                    <Image
                        src={images[1].src}
                        alt={images[1].alt}
                        fill
                        className="object-cover w-full h-full"
                        data-ai-hint={images[1].hint}
                    />
                </div>
                 <div className="relative rounded-lg overflow-hidden">
                    <Image
                        src={images[2].src}
                        alt={images[2].alt}
                        fill
                        className="object-cover w-full h-full"
                        data-ai-hint={images[2].hint}
                    />
                </div>
                 <div className="relative rounded-lg overflow-hidden">
                    <Image
                        src={images[3].src}
                        alt={images[3].alt}
                        fill
                        className="object-cover w-full h-full"
                        data-ai-hint={images[3].hint}
                    />
                     <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Button variant="secondary" className="bg-white/80 hover:bg-white text-black">
                            <ImageIcon className="w-5 h-5 mr-2" />
                            +29
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
