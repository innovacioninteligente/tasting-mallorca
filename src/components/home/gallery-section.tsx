'use client';

import Image from 'next/image';
import { Camera } from 'lucide-react';

const galleryImages = [
  { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC07636-Mejorado-NR.jpg?alt=media&token=083f05f7-cddb-498a-a044-056ee1834adc', hint: 'happy couple travel' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC07651-Mejorado-NR.jpg?alt=media&token=e14dbbb0-7221-4bc4-b47a-8b01915e16b1', hint: 'woman travel backpack' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC07689-Mejorado-NR.jpg?alt=media&token=4ed4a450-a529-4e29-80a9-c74962bfc760', hint: 'hiker mountain view' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC07697-Mejorado-NR.jpg?alt=media&token=59d167ee-edc9-4021-ba8a-bcfbe6342d1c', hint: 'traveler city skyline' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC07701-Mejorado-NR.jpg?alt=media&token=ad6a33ad-3b8e-48bb-bb27-b745f3ed03d4', hint: 'tropical huts water' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2Farta.webp?alt=media&token=d0bd894c-736e-4f72-8f4c-0506ce26e4f0', hint: 'woman pink dress cliff' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC07715-Mejorado-NR.jpg?alt=media&token=9c653a7e-ed1d-41e9-8bf6-19f5b554d1b4', hint: 'happy man beach' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC07923-Mejorado-NR.jpg?alt=media&token=3220a405-18af-4354-8e2e-1d6138137922', hint: 'family airport travel' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC07927-Mejorado-NR.jpg?alt=media&token=3cd8ed5c-69a8-4268-b73c-7948dc6eaa34', hint: 'hiker looking at cliffs' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC08000-Mejorado-NR.jpg?alt=media&token=49f4cd5e-6528-4c41-8438-e76afec57e6b', hint: 'woman yellow dress beach' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC07842-Mejorado-NR.jpg?alt=media&token=1fda44e7-fd51-456a-8a2a-abd405c91613', hint: 'couple walking city' },
  { src: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FDSC07852-Mejorado-NR.jpg?alt=media&token=998eb000-2ed9-410b-b9e1-c56aa67965b0', hint: 'couple walking city' },
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
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {galleryImages.map((img, index) => (
                <div key={index} className="break-inside-avoid">
                    <Image 
                    src={img.src} 
                    alt={`Gallery image ${index + 1}`} 
                    width={500} 
                    height={500} 
                    className="w-full h-auto object-cover rounded-2xl" 
                    data-ai-hint={img.hint}
                    />
                </div>
                ))}
            </div>
            </div>
      </section>
    );
}
