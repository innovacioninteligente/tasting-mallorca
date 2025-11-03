import Link from 'next/link';
import { Sprout, Mail, Phone, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <Sprout className="h-8 w-8 text-primary" />
            <span className="font-headline text-2xl font-bold">
              Tasting Mallorca
            </span>
          </Link>
          <p className="text-base">
            Authentic tours, without the rush. Discover the real Mallorca with us.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-base">
            <li><Link href="/tours" className="hover:text-primary transition-colors">Tours</Link></li>
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            <li><Link href="/road-map" className="hover:text-primary transition-colors">Road Map</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Contact Us</h3>
          <ul className="space-y-3 text-base">
            <li className="flex items-center gap-3">
              <Mail className="h-6 w-6 text-primary" />
              <a href="mailto:info@tastingmallorca.com" className="hover:text-primary transition-colors">info@tastingmallorca.com</a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-6 w-6 text-primary" />
              <a href="tel:+34606830376" className="hover:text-primary transition-colors">+34 606 830 376</a>
            </li>
            <li className="flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-primary" />
              <a href="https://wa.me/34606830376" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">WhatsApp</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Legal</h3>
          <ul className="space-y-2 text-base">
            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="container text-center mt-8 pt-8 border-t border-border">
        <p className="text-base">&copy; {new Date().getFullYear()} Tasting Mallorca. All rights reserved.</p>
      </div>
    </footer>
  );
}
