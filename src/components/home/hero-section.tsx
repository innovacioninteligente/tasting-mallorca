'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

type HeroDictionary = {
    welcome: string;
    title: string;
    subtitle: string;
    bookNow: string;
    viewAllTours: string;
}

export function HeroSection({ dictionary }: { dictionary: HeroDictionary }) {
  return (
    <section className="relative w-full h-screen flex items-center justify-center text-center">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-cursive font-bold text-primary mb-2">{dictionary.welcome}</h2>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight">
            {dictionary.title}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            {dictionary.subtitle}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="font-bold text-base rounded-full px-8 py-7 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/tours">{dictionary.bookNow}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-bold text-base rounded-full px-8 py-7">
              <Link href="/tours">{dictionary.viewAllTours}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
