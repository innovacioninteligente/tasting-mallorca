
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Sprout, ArrowRight } from 'lucide-react';
import { type getDictionary } from '@/dictionaries/get-dictionary';
import { Button } from '../ui/button';

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
  {
    name: 'Cala S\'Almunia',
    image: 'https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Ffotos%20top%20destinations%2Fview-cala-s-almunia-mallorca-spain.jpg?alt=media&token=7f2d1dd6-c82e-4bfc-bf4c-2782cd44077b',
    imageHint: 'Cala S\'Almunia beach',
    className: ''
  },
];

export function TopDestinationsSection({ dictionary }: TopDestinationsProps) {
    const mainDestinations = destinations.slice(0, 6);
    const lastDestination = destinations[6];

    return (
        <section className="py-24 bg-background flex flex-col items-center">
            <div className="container text-center mb-12">
                <div className='flex justify-center items-center gap-2'>
                <Sprout className="w-6 h-6 text-accent" />
                <p className="text-accent font-cursive font-bold text-lg">{dictionary.subtitle}</p>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold mt-2">{dictionary.title}</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                {dictionary.description}
                </p>
            </div>
            <div className="w-full px-4 md:px-0 md:w-[90vw] mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[350px] gap-4">
                {mainDestinations.map((dest) => (
                    <div key={dest.name} className={`relative rounded-2xl overflow-hidden group h-full ${dest.className}`}>
                        <Image
                            src={dest.image}
                            alt={dest.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={dest.imageHint}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-6 text-white">
                            <h3 className="text-2xl font-bold">{dest.name}</h3>
                        </div>
                        <div className="absolute top-4 right-4 h-12 w-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-45 group-hover:bg-primary">
                            <ArrowUpRight className="h-6 w-6 text-white" />
                        </div>
                    </div>
                ))}
                <div className="p-8 rounded-xl bg-secondary flex flex-col items-center justify-center text-center md:col-span-2">
                    <h3 className="text-3xl font-extrabold text-foreground">{dictionary.ctaTitle}</h3>
                    <p className="mt-2 text-muted-foreground">{dictionary.ctaSubtitle}</p>
                    <Button asChild size="lg" className="mt-6 font-bold rounded-full group">
                        <Link href="/tours">
                            {dictionary.ctaButton}
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
                 <div key={lastDestination.name} className={`relative rounded-2xl overflow-hidden group h-full ${lastDestination.className}`}>
                        <Image
                            src={lastDestination.image}
                            alt={lastDestination.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={lastDestination.imageHint}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-6 text-white">
                            <h3 className="text-2xl font-bold">{lastDestination.name}</h3>
                        </div>
                        <div className="absolute top-4 right-4 h-12 w-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-45 group-hover:bg-primary">
                            <ArrowUpRight className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
