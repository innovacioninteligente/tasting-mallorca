'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, MapPin, Mail, Clock, Search, Briefcase } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/pages', label: 'Pages' },
  { href: '/tours', label: 'Tours' },
  { href: '/destination', label: 'Destination' },
  { href: '/road-map', label: 'Road Map'},
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="bg-[var(--header-dark-background)] text-[var(--header-dark-foreground)] py-2">
        <div className="container flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>6391 Elgin St. Celina, Delaware 10299</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>exam126@gmail.com</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Opening Hour 9:00am - 10:00pm</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-background">
        <div className="container flex h-24 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 -ml-4" prefetch={false}>
            <div className="bg-primary text-primary-foreground h-24 w-24 flex items-center justify-center rounded-br-3xl">
              <Briefcase className="h-10 w-10" />
            </div>
            <span className="font-headline text-3xl font-bold -ml-2">
              TravHub
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
             <Search className="h-5 w-5 text-foreground/80 cursor-pointer hover:text-primary" />
             <Button asChild size="lg" className="font-bold text-base rounded-full px-6 py-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/tours">Start Booking</Link>
             </Button>
          </div>

          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-8 w-8" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col gap-6 p-6">
                  <Link href="/" className="flex items-center gap-2" prefetch={false}>
                     <Briefcase className="h-8 w-8 text-primary" />
                    <span className="font-headline text-2xl font-bold">
                      TravHub
                    </span>
                  </Link>
                  <nav className="flex flex-col gap-4 text-lg">
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
                  <div className="flex flex-col gap-4">
                     <Button asChild size="lg" className="font-bold text-lg bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Link href="/tours">Start Booking</Link>
                     </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
