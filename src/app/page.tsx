import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const hikerImage = PlaceHolderImages.find(img => img.id === 'hiker-with-backpack');
const travelGirlImage = PlaceHolderImages.find(img => img.id === 'girl-travel-view');


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
              <h2 className="text-lg font-semibold text-primary mb-2">Welcome to TravHub</h2>
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
      
      {/* Other sections can go here */}

    </div>
  );
}