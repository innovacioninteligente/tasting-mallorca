import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Sprout } from 'lucide-react';

const hikerImage = PlaceHolderImages.find(img => img.id === 'hiker-with-backpack');
const travelGirlImage = PlaceHolderImages.find(img => img.id === 'girl-travel-view');

const destinations = [
  {
    name: 'New York',
    listings: 12,
    image: 'https://picsum.photos/seed/ny/400/600',
    imageHint: 'new york city',
    featured: true,
  },
  {
    name: 'London',
    listings: 22,
    image: 'https://picsum.photos/seed/london/400/600',
    imageHint: 'london city',
  },
  {
    name: 'San Francisco',
    listings: 10,
    image: 'https://picsum.photos/seed/sf/400/600',
    imageHint: 'san francisco bridge',
  },
  {
    name: 'Paris',
    listings: 12,
    image: 'https://picsum.photos/seed/paris/400/600',
    imageHint: 'paris eiffel tower',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        <div className="container py-20 md:py-32">
          <div className="grid grid-cols-12 gap-8 items-center">
            {/* Left Image & Doodles */}
            <div className="col-span-3 hidden md:flex flex-col items-center justify-end h-full">
              {/* Airplane Doodle */}
              <div className="w-48 h-24 relative self-start -mb-8 ml-4">
                  <Image src="/airplane-doodle.svg" alt="Airplane doodle" fill className="object-contain"/>
              </div>
              {hikerImage && (
                <div className="relative w-56 h-56">
                  <Image
                    src={hikerImage.imageUrl}
                    alt={hikerImage.description}
                    fill
                    className="object-cover rounded-full"
                    data-ai-hint={hikerImage.imageHint}
                  />
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="col-span-12 md:col-span-6 text-center z-10">
              <h2 className="text-lg font-semibold text-primary mb-2">Welcome to Tasting Mallorca</h2>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight">
                Adventure & Experience The Travel
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-md mx-auto">
                The leap into electronic typesetting, remaining essentially unchanged. It was popularised, trust with our company
              </p>
            </div>

            {/* Right Image & Doodles */}
            <div className="col-span-3 hidden md:flex flex-col items-center justify-start h-full">
               {travelGirlImage && (
                <div className="relative w-56 h-56">
                  <Image
                    src={travelGirlImage.imageUrl}
                    alt={travelGirlImage.description}
                    fill
                    className="object-cover rounded-full"
                    data-ai-hint={travelGirlImage.imageHint}
                  />
                </div>
              )}
              {/* Balloon Doodle */}
              <div className="w-32 h-48 relative self-end -mt-8 mr-4">
                <Image src="/balloon-doodle.svg" alt="Hot air balloon doodle" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Top Destinations Section */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <div className='flex justify-center items-center gap-2'>
              <Sprout className="w-6 h-6 text-primary" />
              <p className="text-primary font-semibold text-lg">Destinations</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-2">Top Destinations</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              Content of a page when looking at layout the point of using lorem the is Ipsum less
            </p>
          </div>
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
                  <Badge variant="secondary" className="mt-2 bg-white/30 text-white backdrop-blur-sm border-0">
                    {dest.listings} Listing
                  </Badge>
                </div>
                {dest.featured && (
                   <div className="absolute top-4 right-4 h-12 w-12 bg-primary rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-45">
                     <ArrowUpRight className="h-6 w-6 text-primary-foreground" />
                   </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
