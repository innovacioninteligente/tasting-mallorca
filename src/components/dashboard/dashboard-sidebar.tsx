'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sprout,
  LayoutDashboard,
  Ticket,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard/overview', icon: LayoutDashboard, label: 'Overview' },
  { href: '/dashboard/bookings', icon: Ticket, label: 'My Bookings' },
  { href: '/dashboard/profile', icon: User, label: 'Profile' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();
  
  // Extract lang from pathname
  const lang = pathname.split('/')[1] || 'en';

  const handleSignOut = async () => {
    if (auth) {
      await auth.signOut();
      router.push(`/${lang}/`);
    }
  };

  return (
    <aside className="hidden w-64 flex-col border-r bg-secondary/50 md:flex">
      <div className="flex h-20 items-center border-b px-6">
        <Link href={`/${lang}/`} className="flex items-center gap-2 font-semibold">
          <Sprout className="h-7 w-7 text-primary" />
          <span className="font-headline text-xl">Tasting Mallorca</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const href = `/${lang}${item.href}`;
          return (
            <Link key={item.href} href={href}>
              <Button
                variant={pathname.startsWith(href) ? 'secondary' : 'ghost'}
                className="w-full justify-start text-base"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-4">
        <Button variant="ghost" className="w-full justify-start text-base" onClick={handleSignOut}>
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
