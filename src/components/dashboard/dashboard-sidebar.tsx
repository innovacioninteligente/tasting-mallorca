'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sprout,
  LayoutDashboard,
  Ticket,
  User,
  Settings,
  LogOut,
  Users,
} from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard/overview', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/bookings', label: 'My Bookings', icon: Ticket },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

const adminNavItems = [
    { href: '/dashboard/users', label: 'Manage Users', icon: Users, role: 'admin' },
];

const bottomNavItems = [
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();
  
  const lang = pathname.split('/')[1] || 'en';

  const handleSignOut = async () => {
    if (auth) {
      await auth.signOut();
      router.push(`/${lang}/`);
    }
  };

  const userRole = user?.customClaims?.role;

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
          const Icon = item.icon;
          return (
            <Link key={item.href} href={href}>
              <Button
                variant={pathname.startsWith(href) ? 'secondary' : 'ghost'}
                className="w-full justify-start text-base"
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          );
        })}

        {adminNavItems.map((item) => {
            if (item.role && userRole !== item.role) return null;
            const href = `/${lang}${item.href}`;
            const Icon = item.icon;
            return (
                <Link key={item.href} href={href}>
                <Button
                    variant={pathname.startsWith(href) ? 'secondary' : 'ghost'}
                    className="w-full justify-start text-base"
                >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                </Button>
                </Link>
            );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-2 p-4">
        {bottomNavItems.map((item) => {
             const href = `/${lang}${item.href}`;
             const Icon = item.icon;
             return (
                 <Link key={item.href} href={href}>
                 <Button
                     variant={pathname.startsWith(href) ? 'secondary' : 'ghost'}
                     className="w-full justify-start text-base"
                 >
                     <Icon className="mr-3 h-5 w-5" />
                     {item.label}
                 </Button>
                 </Link>
             );
        })}
        <Button variant="ghost" className="w-full justify-start text-base" onClick={handleSignOut}>
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
