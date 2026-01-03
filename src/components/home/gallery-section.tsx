
'use client';

import Image from 'next/image';
import { Camera, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from '../ui/button';
import Link from 'next/link';
import { type getDictionary } from '@/dictionaries/get-dictionary';
import { SectionBadge } from '@/components/ui/section-badge';

type GallerySectionProps = {
    dictionary: Awaited<ReturnType<typeof getDictionary>>['gallery'];
}

const galleryImages = [
    { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC07636-Mejorado-NR.jpg?alt=media&token=083f05f7-cddb-498a-a044-056ee1834adc', hint: 'happy couple travel', className: 'col-span-1 md:col-span-2 md:row-span-2' },
    { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC07689-Mejorado-NR.jpg?alt=media&token=4ed4a450-a529-4e29-80a9-c74962bfc760', hint: 'hiker mountain view', className: 'row-span-2' },
    { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC07701-Mejorado-NR.jpg?alt=media&token=ad6a33ad-3b8e-48bb-bb27-b745f3ed03d4', hint: 'tropical huts water', className: 'col-span-1' },
    { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC07697-Mejorado-NR.jpg?alt=media&token=59d167ee-edc9-4021-ba8a-bcfbe6342d1c', hint: 'traveler city skyline', className: 'col-span-1' },
    { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2Farta.webp?alt=media&token=d0bd894c-736e-4f72-8f4c-0506ce26e4f0', hint: 'woman pink dress cliff', className: 'row-span-2' },
    { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC07927-Mejorado-NR.jpg?alt=media&token=3cd8ed5c-69a8-4268-b73c-7948dc6eaa34', hint: 'hiker looking at cliffs', className: 'col-span-1' },
    { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC07715-Mejorado-NR.jpg?alt=media&token=9c653a7e-ed1d-41e9-8bf6-19f5b554d1b4', hint: 'happy man beach', className: 'col-span-1 md:col-span-2' },
    { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC07651-Mejorado-NR.jpg?alt=media&token=e14dbbb0-7221-4bc4-b47a-8b01915e16b1', hint: 'woman travel backpack', className: 'col-span-1' },
];


export function GallerySection({ dictionary }: GallerySectionProps) {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const openLightbox = (index: number) => {
        setSelectedImageIndex(index);
        setIsLightboxOpen(true);
    };

    return (
        <section className="py-24 bg-background flex flex-col items-center">
            <div className="container text-center mb-12">
                <SectionBadge className="mb-4">
                    <Camera className="w-5 h-5" />
                    {dictionary.subtitle}
                </SectionBadge>
                <h2 className="text-4xl md:text-5xl font-extrabold mt-2 text-foreground">{dictionary.title}</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                    {dictionary.description}
                </p>
            </div>

            <div className="w-full px-4 md:px-0 md:w-[80vw] mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[250px] gap-2 md:gap-4">
                    {galleryImages.map((img, index) => (
                        <div key={index} className={`relative rounded-xl overflow-hidden group cursor-pointer ${img.className}`} onClick={() => openLightbox(index)}>
                            <Image
                                src={img.src}
                                alt={`Gallery image ${index + 1}`}
                                fill
                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint={img.hint}
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20"></div>
                        </div>
                    ))}
                    <div className="col-span-2 md:col-span-2 p-8 rounded-xl bg-secondary flex flex-col items-center justify-center text-center">
                        <h3 className="text-3xl font-extrabold text-foreground">{dictionary.ctaTitle}</h3>
                        <p className="mt-2 text-muted-foreground">{dictionary.ctaSubtitle}</p>
                        <Button asChild size="lg" className="mt-6 font-bold rounded-full group">
                            <Link href="/tours">
                                {dictionary.ctaButton}
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
                <DialogContent className="max-w-none w-screen h-screen p-0 bg-background/80 backdrop-blur-sm border-0 flex items-center justify-center">
                    <DialogTitle className="sr-only">Image Gallery Lightbox</DialogTitle>
                    <DialogDescription className="sr-only">A carousel of gallery images in a larger view.</DialogDescription>
                    <Carousel
                        opts={{
                            loop: true,
                            startIndex: selectedImageIndex,
                        }}
                        className="w-full h-full max-w-7xl"
                    >
                        <CarouselContent className="h-full">
                            {galleryImages.map((img, index) => (
                                <CarouselItem key={index} className="flex items-center justify-center p-4">
                                    <div className="relative w-full h-[90vh]">
                                        <Image
                                            src={img.src}
                                            alt={`Gallery image ${index + 1}`}
                                            fill
                                            className="object-contain"
                                            sizes="100vw"
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground bg-background/50 hover:bg-background/70 border-border h-12 w-12" />
                        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground bg-background/50 hover:bg-background/70 border-border h-12 w-12" />
                    </Carousel>
                </DialogContent>
            </Dialog>
        </section >
    );
}
