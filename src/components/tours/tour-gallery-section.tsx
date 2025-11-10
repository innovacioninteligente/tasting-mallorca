
'use client';

import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from 'react';

interface TourGallerySectionProps {
    images: string[];
}

export function TourGallerySection({ images }: TourGallerySectionProps) {
    const autoplayPlugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
    
    if (!images || images.length === 0) {
        return null;
    }

    const mainImage = images[0];
    const galleryGridImages = images.slice(1, 4); // Get up to 3 images for the grid
    const remainingImageCount = images.length - 1 - galleryGridImages.length;


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
                                        src={image}
                                        alt={`Tour gallery image ${index + 1}`}
                                        fill
                                        sizes="100vw"
                                        className="object-cover w-full h-full"
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
                        src={mainImage}
                        alt="Main tour image"
                        fill
                        sizes="(max-width: 1023px) 100vw, 50vw"
                        className="object-cover w-full h-full view-transition"
                        priority
                        style={{ viewTransitionName: `tour-image-main` } as React.CSSProperties}
                    />
                </div>

                {/* Smaller Images */}
                {galleryGridImages.map((image, index) => (
                     <div key={index} className="relative rounded-lg overflow-hidden">
                        <Image
                            src={image}
                            alt={`Tour gallery image ${index + 2}`}
                            fill
                            sizes="25vw"
                            className="object-cover w-full h-full"
                        />
                         {index === galleryGridImages.length - 1 && remainingImageCount > 0 && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <Button variant="secondary" className="bg-white/80 hover:bg-white text-black">
                                    <ImageIcon className="w-5 h-5 mr-2" />
                                    +{remainingImageCount}
                                </Button>
                            </div>
                         )}
                    </div>
                ))}
            </div>
        </div>
    );
}
