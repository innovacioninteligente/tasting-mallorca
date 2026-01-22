
'use client';

import Image from 'next/image';
import { ImageIcon, X, Play } from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';

const GalleryImage = ({ src, alt, className, sizes, priority = false, style, onClick }: any) => {
    const [isLoading, setIsLoading] = useState(true);
    return (
        <div className={`relative w-full h-full ${className}`} onClick={onClick} style={style}>
            {isLoading && <Skeleton className="absolute inset-0 w-full h-full" />}
            <Image
                src={src}
                alt={alt}
                fill
                sizes={sizes}
                className={`object-cover w-full h-full transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                priority={priority}
                unoptimized
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
};

interface TourGallerySectionProps {
    images: (string | undefined | null)[];
    video?: string | undefined | null;
}

export function TourGallerySection({ images: rawImages, video }: TourGallerySectionProps) {
    const autoplayPlugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const images = rawImages.filter((img): img is string => !!img);

    if (images.length === 0) {
        return null;
    }

    const openLightbox = (index: number) => {
        setSelectedImageIndex(index);
        setIsLightboxOpen(true);
    };

    const mainImage = images[0];
    const galleryGridImages = images.slice(1, 4);
    const remainingImageCount = images.length > 4 ? images.length - 4 : 0;


    return (
        <div className="w-full md:w-[80vw] mx-auto px-4 mt-8">
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
                                    <GalleryImage
                                        src={image}
                                        alt={`Tour gallery image ${index + 1}`}
                                        sizes="100vw"
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
                    <GalleryImage
                        src={mainImage}
                        alt="Main tour image"
                        sizes="(max-width: 1023px) 100vw, 50vw"
                        className="view-transition"
                        priority
                        style={{ viewTransitionName: `tour-image-main` } as React.CSSProperties}
                    />
                    {video && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors group">
                            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Play className="w-8 h-8 text-primary ml-1" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Smaller Images */}
                {galleryGridImages.map((image, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden cursor-pointer" onClick={() => openLightbox(index + 1)}>
                        <GalleryImage
                            src={image}
                            alt={`Tour gallery image ${index + 2}`}
                            sizes="25vw"
                        />
                        {index === galleryGridImages.length - 1 && remainingImageCount > 0 && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center" onClick={(e) => { e.stopPropagation(); openLightbox(index + 1); }}>
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
                <DialogContent className="max-w-none w-screen h-screen p-0 bg-background/80 backdrop-blur-sm border-0 flex items-center justify-center">
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
                            {video && (
                                <CarouselItem className="flex items-center justify-center p-4">
                                    <div className="relative w-full h-[90vh] bg-black rounded-lg overflow-hidden flex items-center justify-center">
                                        <video
                                            src={video}
                                            controls
                                            className="w-full h-full max-h-[90vh] object-contain"
                                            playsInline
                                            autoPlay
                                        />
                                    </div>
                                </CarouselItem>
                            )}
                            {images.map((img, index) => (
                                <CarouselItem key={index} className="flex items-center justify-center p-4">
                                    <div className="relative w-full h-[90vh]">
                                        <Image
                                            src={img}
                                            alt={`Tour gallery image ${index + 1}`}
                                            fill
                                            className="object-contain"
                                            sizes="100vw"
                                            unoptimized
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground bg-background/50 hover:bg-background/70 border-border h-12 w-12" />
                        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground bg-background/50 hover:bg-background/70 border-border h-12 w-12" />
                    </Carousel>
                    <DialogClose className="absolute right-4 top-4 rounded-full p-2 bg-background/50 text-foreground opacity-80 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring">
                        <X className="h-8 w-8" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        </div>
    );
}
