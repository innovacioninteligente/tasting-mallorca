
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

type HeroDictionary = {
    welcome: string;
    title: string;
    subtitle: string;
    bookNow: string;
    viewAllTours: string;
}

export function HeroSection({ dictionary }: { dictionary: HeroDictionary }) {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center text-center pb-20 bg-background">
      <Image
        src="https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fimages%2Fbanner-hero.png?alt=media&token=cebdf583-f589-4835-b72f-197a731e2d1f"
        alt="Tasting Mallorca Hero background"
        fill
        className="object-cover"
        priority
        sizes="100vw"
        data-ai-hint="mallorca boat trip"
      />

      <div className="container relative">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-cursive font-bold text-accent mb-2">{dictionary.welcome}</h2>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight text-foreground">
            {dictionary.title}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            {dictionary.subtitle}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="font-bold text-base rounded-full px-8 py-7 bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto">
              <Link href="/tours">{dictionary.bookNow}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-bold text-base rounded-full px-8 py-7 w-full sm:w-auto border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/50">
              <Link href="/tours">{dictionary.viewAllTours}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
