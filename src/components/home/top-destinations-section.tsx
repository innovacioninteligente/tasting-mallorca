'use client';

import Image from 'next/image';
import { ArrowUpRight, Sprout } from 'lucide-react';
import { type getDictionary } from '@/dictionaries/get-dictionary';

type TopDestinationsProps = {
    dictionary: Awaited<ReturnType<typeof getDictionary>>['destinations'];
}

const destinations = [
  {
    name: 'Valldemosa',
    image: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2Fthe-royal-carthusian-monastery-valldemossa-valldemossa-698.webp?alt=media&token=ef1d3230-df85-4f5c-9c77-ff44d2ec64d5',
    imageHint: 'Valldemossa monastery',
  },
  {
    name: 'Torre de Verger',
    image: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2Ftorre-de-verger.webp?alt=media&token=4971c9fe-3696-49e9-a397-c7a2cb85fbac',
    imageHint: 'Torre de Verger coast',
  },
  {
    name: 'Petra',
    image: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FIglesia-de-Sant-Pere.webp?alt=media&token=a3620cfb-c25f-4e91-b4e5-640df2fb8f99',
    imageHint: 'Petra church',
  },
  {
    name: 'Artà',
    image: 'https://firebasestorage.googleapis.com/v0/b/amparo-aesthetics.firebasestorage.app/o/tasting-mallorca%2Fimages%2FArt%C3%A0_Sant_Salvador_01.webp?alt=media&token=30217468-6904-4f6a-b5a4-8fa32fe79cb6',
    imageHint: 'Artà Sant Salvador',
  },
];

export function TopDestinationsSection({ dictionary }: TopDestinationsProps) {
    return (
        <section className="py-24 bg-background flex flex-col items-center">
            <div className="container text-center mb-12">
                <div className='flex justify-center items-center gap-2'>
                <Sprout className="w-6 h-6 text-primary" />
                <p className="text-primary font-cursive font-bold text-lg">{dictionary.subtitle}</p>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold mt-2">{dictionary.title}</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                {dictionary.description}
                </p>
            </div>
            <div className="w-full px-4 md:px-0 md:w-[90vw] mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {destinations.map((dest) => (
                    <div key={dest.name} className="relative rounded-2xl overflow-hidden group h-[400px]">
                    <Image
                        src={dest.image}
                        alt={dest.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={dest.imageHint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 text-white">
                        <h3 className="text-2xl font-bold">{dest.name}</h3>
                    </div>
                    <div className="absolute top-4 right-4 h-12 w-12 bg-primary rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-45">
                        <ArrowUpRight className="h-6 w-6 text-primary-foreground" />
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </section>
    );
}
