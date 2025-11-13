
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Menu, Sprout } from 'lucide-react';
import { type Locale } from '@/dictionaries/config';
import { type getDictionary } from '@/dictionaries/get-dictionary';
import { LanguageSwitcher } from './language-switcher';
import { useState } from 'react';

type HeaderProps = {
    dictionary: Awaited<ReturnType<typeof getDictionary>>['header'];
    lang: Locale;
}

export function Header({ dictionary, lang }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: `/${lang}/`, label: dictionary.home },
    { href: `/${lang}/about`, label: dictionary.about },
    { href: `/${lang}/tours`, label: dictionary.tours },
    { href: `/${lang}/blog`, label: "Blog" },
    { href: `/${lang}/contact`, label: dictionary.contact },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Main Header */}
      <div className="w-full md:w-[90vw] mx-auto px-4 flex h-20 items-center justify-between">
        <Link href={`/${lang}/`} className="flex items-center gap-3 -ml-4" prefetch={false}>
          <div className="bg-primary text-primary-foreground h-20 w-20 flex items-center justify-center rounded-br-3xl">
            <Sprout className="h-10 w-10" />
          </div>
          <span className="font-headline text-2xl md:text-3xl font-bold -ml-2">
            Tasting Mallorca
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-base lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium text-foreground/80 transition-colors hover:text-primary"
              prefetch={false}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="hidden items-center gap-4 lg:flex">
           <LanguageSwitcher currentLocale={lang} />
           <Button asChild size="lg" className="font-bold text-base rounded-full px-6 py-6 bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href={`/${lang}/tours`}>{dictionary.startBooking}</Link>
           </Button>
        </div>

        <div className="lg:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-8 w-8" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 p-6">
                <Link href={`/${lang}/`} className="flex items-center gap-2" prefetch={false} onClick={() => setIsMobileMenuOpen(false)}>
                   <Sprout className="h-8 w-8 text-primary" />
                  <span className="font-headline text-2xl font-bold">
                    Tasting Mallorca
                  </span>
                </Link>
                <nav className="flex flex-col gap-4 text-lg">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="font-medium text-foreground/80 transition-colors hover:text-primary"
                      prefetch={false}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                 <div className="mt-4">
                  <LanguageSwitcher currentLocale={lang} />
                </div>
                <div className="flex flex-col gap-4 mt-4">
                   <Button asChild size="lg" className="font-bold text-lg bg-accent hover:bg-accent/90 text-accent-foreground">
                      <Link href={`/${lang}/tours`} onClick={() => setIsMobileMenuOpen(false)}>{dictionary.startBooking}</Link>
                   </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
