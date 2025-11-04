'use client';

import Image from 'next/image';
import { Camera } from 'lucide-react';

const galleryImages = [
  { src: 'https://picsum.photos/seed/gallery1/500/800', hint: 'happy couple travel' },
  { src: 'https://picsum.photos/seed/gallery2/600/400', hint: 'woman travel backpack' },
  { src: 'https://picsum.photos/seed/gallery3/500/600', hint: 'hiker mountain view' },
  { src: 'https://picsum.photos/seed/gallery4/600/400', hint: 'traveler city skyline' },
  { src: 'https://picsum.photos/seed/gallery5/500/700', hint: 'tropical huts water' },
  { src: 'https://picsum.photos/seed/gallery6/600/400', hint: 'woman pink dress cliff' },
  { src: 'https://picsum.photos/seed/gallery7/500/600', hint: 'happy man beach' },
  { src: 'https://picsum.photos/seed/gallery8/600/800', hint: 'family airport travel' },
  { src: 'https://picsum.photos/seed/gallery9/500/500', hint: 'hiker looking at cliffs' },
  { src: 'https://picsum.photos/seed/gallery10/600/900', hint: 'woman yellow dress beach' },
  { src: 'https://picsum.photos/seed/gallery11/500/700', hint: 'couple walking city' },
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
