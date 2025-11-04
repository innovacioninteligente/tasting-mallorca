
'use client';

import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const images = [
    { src: 'https://picsum.photos/seed/tour-gallery1/800/600', alt: 'Scenic view of Valldemossa', hint: 'valldemossa aerial view' },
    { src: 'https://picsum.photos/seed/tour-gallery2/400/300', alt: 'Couple walking in a charming street', hint: 'couple walking old town' },
    { src: 'https://picsum.photos/seed/tour-gallery3/400/300', alt: 'Narrow cobblestone street in a village', hint: 'cobblestone street mallorca' },
    { src: 'https://picsum.photos/seed/tour-gallery4/400/600', alt: 'View of the coast from a viewpoint', hint: 'mallorca coast viewpoint' },
];

export function TourGallerySection() {
    return (
        <div className="w-full md:w-[90vw] mx-auto px-4 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 h-[50vh]">
                {/* Main Image */}
                <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 relative rounded-lg overflow-hidden">
                    <Image
                        src={images[0].src}
                        alt={images[0].alt}
                        fill
                        className="object-cover w-full h-full"
                        data-ai-hint={images[0].hint}
                        priority
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
