
import { Metadata } from 'next';
import Image from 'next/image';
import { PrivateTourForm } from './private-tour-form';

export const metadata: Metadata = {
  title: 'Private Tours Mallorca – Tailor-Made Experiences',
  description: 'Discover Mallorca your way. Personalized tours with local guides, authentic food, and hidden villages.',
};

export default function PrivateToursPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-extrabold font-headline">
                Private Tours Mallorca – Create Your Own Experience
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Looking for a more personal experience? Tell us what you’d like to discover and we’ll design a private tour just for you — with a local guide, authentic food, and exclusive stops across Mallorca.
              </p>
            </div>
            <div className="mt-12">
              <PrivateTourForm />
            </div>
          </div>
          <div className="order-1 lg:order-2 h-[400px] lg:h-[600px] relative rounded-2xl overflow-hidden">
            <Image
              src="https://picsum.photos/seed/private-tour/600/800"
              alt="Scenic view of Mallorca"
              fill
              className="object-cover"
              data-ai-hint="mallorca landscape scenic"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
