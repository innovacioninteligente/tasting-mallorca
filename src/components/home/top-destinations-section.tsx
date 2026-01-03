
'use client';

import { SectionBadge } from '@/components/ui/section-badge';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, X, MapPin } from 'lucide-react';
import { type getDictionary } from '@/dictionaries/get-dictionary';
import { Button } from '../ui/button';
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

type TopDestinationsProps = {
    dictionary: Awaited<ReturnType<typeof getDictionary>>['destinations'];
}

const destinations = [
    {
        name: 'Artà',
        image: 'https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Ffotos%20top%20destinations%2FArta.png?alt=media&token=fa3396de-9c44-480d-aec5-a048344d772f',
        imageHint: 'Artà landscape',
        className: 'md:col-span-2'
    },
    {
        name: 'Ermita de Bonany',
        image: 'https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Ffotos%20top%20destinations%2FErmita%20de%20Bonany.jpg?alt=media&token=fc73a916-e8a4-4af9-b0eb-a97d79df51f9',
        imageHint: 'Ermita de Bonany church',
        className: 'md:row-span-2'
    },
    {
        name: 'Mirador Es Grau',
        image: 'https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Ffotos%20top%20destinations%2FMirador%20Es%20Grau.jpg?alt=media&token=4b952542-71ac-4ad5-a441-52ed163fcc9d',
        imageHint: 'Mirador Es Grau view',
        className: ''
    },
    {
        name: 'Petra',
        image: 'https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Ffotos%20top%20destinations%2FPetra.jpg?alt=media&token=03514b21-ff6c-4a97-a92f-cb0bf73a3b8b',
        imageHint: 'Petra village',
        className: ''
    },
    {
        name: 'Sineu',
        image: 'https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Ffotos%20top%20destinations%2FSineu.jpg?alt=media&token=d9b7b93a-a07a-4624-9014-504394f37483',
        imageHint: 'Sineu market',
        className: ''
    },
    {
        name: 'Valldemossa',
        image: 'https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Ffotos%20top%20destinations%2FVALLDEMOSSA%202.jpg?alt=media&token=05d35042-3bac-419e-8095-046cb75d7bc5',
        imageHint: 'Valldemossa town',
        className: 'md:col-span-2'
    },
];

export function TopDestinationsSection({ dictionary }: TopDestinationsProps) {
    const mainDestinations = destinations.slice(0, 6);
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
                    <MapPin className="w-5 h-5" />
                    {dictionary.subtitle}
                </SectionBadge>
                <h2 className="text-4xl md:text-5xl font-extrabold mt-2 text-foreground">{dictionary.title}</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                    {dictionary.description}
                </p>
            </div>
            <div className="w-full px-4 md:px-0 md:w-[80vw] mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[350px] gap-4">
                    {mainDestinations.map((dest, index) => (
                        <div
                            key={dest.name}
                            className={`relative rounded-2xl overflow-hidden group h-full cursor-pointer ${dest.className}`}
                            onClick={() => openLightbox(index)}
                        >
                            <Image
                                src={dest.image}
                                alt={dest.name}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint={dest.imageHint}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                            {/* Glassmorphism Title Card */}
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <div className="bg-white/20 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-lg">
                                    <h3 className="text-xl font-bold text-white text-center">{dest.name}</h3>
                                </div>
                            </div>

                            <div className="absolute top-4 right-4 h-12 w-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-45 group-hover:bg-primary">
                                <ArrowUpRight className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    ))}
                    <div className="p-8 rounded-xl bg-secondary flex flex-col items-center justify-center text-center lg:col-span-3">
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
                    <DialogTitle className="sr-only">Destinations Lightbox</DialogTitle>
                    <DialogDescription className="sr-only">A carousel of destination images.</DialogDescription>
                    <Carousel
                        opts={{
                            loop: true,
                            startIndex: selectedImageIndex,
                        }}
                        className="w-full h-full max-w-7xl"
                    >
                        <CarouselContent className="h-full">
                            {mainDestinations.map((dest, index) => (
                                <CarouselItem key={index} className="flex flex-col items-center justify-center p-4">
                                    <div className="relative w-full h-[85vh]">
                                        <Image
                                            src={dest.image}
                                            alt={dest.name}
                                            fill
                                            className="object-contain"
                                            sizes="100vw"
                                        />
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground mt-4">{dest.name}</h3>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground bg-background/50 hover:bg-background/70 border-border h-12 w-12" />
                        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground bg-background/50 hover:bg-background/70 border-border h-12 w-12" />
                    </Carousel>
                </DialogContent>
            </Dialog>
        </section>
    );
}
