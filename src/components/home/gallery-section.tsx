'use client';

import Image from 'next/image';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

const galleryImages = [
  { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC07636-Mejorado-NR.jpg?alt=media&token=083f05f7-cddb-498a-a044-056ee1834adc', hint: 'happy couple travel', className: 'col-span-2 row-span-2' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC07689-Mejorado-NR.jpg?alt=media&token=4ed4a450-a529-4e29-80a9-c74962bfc760', hint: 'hiker mountain view', className: 'row-span-2' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC07701-Mejorado-NR.jpg?alt=media&token=ad6a33ad-3b8e-48bb-bb27-b745f3ed03d4', hint: 'tropical huts water', className: '' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC07697-Mejorado-NR.jpg?alt=media&token=59d167ee-edc9-4021-ba8a-bcfbe6342d1c', hint: 'traveler city skyline', className: '' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2Farta.webp?alt=media&token=d0bd894c-736e-4f72-8f4c-0506ce26e4f0', hint: 'woman pink dress cliff', className: '' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC07927-Mejorado-NR.jpg?alt=media&token=3cd8ed5c-69a8-4268-b73c-7948dc6eaa34', hint: 'hiker looking at cliffs', className: '' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC07715-Mejorado-NR.jpg?alt=media&token=9c653a7e-ed1d-41e9-8bf6-19f5b554d1b4', hint: 'happy man beach', className: 'col-span-2' },
];


export function GallerySection() {
    return (
        <section className="py-24 bg-background">
            <div className="container text-center mb-12">
                <div className='flex justify-center items-center gap-2'>
                <Camera className="w-6 h-6 text-primary" />
                <p className="text-primary font-cursive font-bold text-lg">Our beautiful moment</p>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold mt-2">Recent Gallery</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                Content of a page when looking at layout the point of using lorem the is Ipsum less
                </p>
            </div>
            <div className="w-full px-4 md:px-0 md:w-[90vw] mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[250px] gap-4">
                    {galleryImages.map((img, index) => (
                        <div key={index} className={`relative rounded-2xl overflow-hidden group ${img.className}`}>
                            <Image
                                src={img.src}
                                alt={`Gallery image ${index + 1}`}
                                fill
                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint={img.hint}
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                            />
                             <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20"></div>
                             <div className="absolute bottom-4 left-4">
                                <Button variant="secondary" size="sm" className="h-8">View</Button>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
      </section>
    );
}
