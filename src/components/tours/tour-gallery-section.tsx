
'use client';

import Image from 'next/image';
import { ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogClose,
  } from "@/components/ui/dialog";
import Autoplay from "embla-carousel-autoplay";
import { useRef, useState } from 'react';

interface TourGallerySectionProps {
    images: string[];
}

export function TourGallerySection({ images }: TourGallerySectionProps) {
    const autoplayPlugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const openLightbox = (index: number) => {
        setSelectedImageIndex(index);
        setIsLightboxOpen(true);
    };
    
    if (!images || images.length === 0) {
        return null;
    }

    const mainImage = images[0];
    const galleryGridImages = images.slice(1, 4); // Get up to 3 images for the grid
    const remainingImageCount = images.length > 4 ? images.length - 4 : 0;


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
                <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 relative rounded-lg overflow-hidden cursor-pointer" onClick={() => openLightbox(0)}>
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
                     <div key={index} className="relative rounded-lg overflow-hidden cursor-pointer" onClick={() => openLightbox(index + 1)}>
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

            <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
                <DialogContent className="max-w-none w-screen h-screen p-0 bg-black/90 border-0 flex items-center justify-center">
                    <DialogTitle className="sr-only">Image Gallery Lightbox</DialogTitle>
                    <DialogDescription className="sr-only">A carousel of all tour images in a larger view.</DialogDescription>
                    <Carousel
                        opts={{
                            loop: true,
                            startIndex: selectedImageIndex,
                        }}
                        className="w-full h-full max-w-7xl"
                    >
                        <CarouselContent className="h-full">
                            {images.map((img, index) => (
                                <CarouselItem key={index} className="flex items-center justify-center p-4">
                                    <div className="relative w-full h-[90vh]">
                                        <Image
                                            src={img}
                                            alt={`Tour gallery image ${index + 1}`}
                                            fill
                                            className="object-contain"
                                            sizes="100vw"
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 border-white/50 h-12 w-12" />
                        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 border-white/50 h-12 w-12" />
                    </Carousel>
                    <DialogClose className="absolute right-4 top-4 rounded-full p-2 bg-black/50 text-white opacity-80 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-white">
                        <X className="h-8 w-8" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        </div>
    );
}
