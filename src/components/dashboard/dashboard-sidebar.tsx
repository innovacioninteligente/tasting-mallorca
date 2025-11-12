

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
  Mountain,
  X,
  Hotel,
  MapPin,
  QrCode,
  Briefcase,
  Newspaper,
  MessageSquareHeart,
} from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '../ui/sheet';
import React from 'react';

const navItems = [
  { href: '/dashboard/overview', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/bookings', label: 'Bookings', icon: Ticket },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

const adminNavItems = [
    { href: '/dashboard/admin/tours', label: 'Manage Tours', icon: Mountain, role: 'admin' },
    { href: '/dashboard/admin/blog', label: 'Manage Blog', icon: Newspaper, role: 'admin' },
    { href: '/dashboard/admin/guest-feedback', label: 'Manage Feedback', icon: MessageSquareHeart, role: 'admin' },
    { href: '/dashboard/admin/private-tours', label: 'Private Tours', icon: Briefcase, role: 'admin' },
    { href: '/dashboard/users', label: 'Manage Users', icon: Users, role: 'admin' },
    { href: '/dashboard/admin/hotels', label: 'Manage Hotels', icon: Hotel, role: 'admin' },
    { href: '/dashboard/admin/meeting-points', label: 'Manage Meeting Points', icon: MapPin, role: 'admin' },
];

const guideNavItems = [
    { href: '/dashboard/guide/validate-ticket', label: 'Validate Ticket', roles: ['guide', 'admin'] }
]

const bottomNavItems = [
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

interface DashboardSidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DashboardSidebar({ isMobileMenuOpen, setIsMobileMenuOpen }: DashboardSidebarProps) {
  const pathname = usePathname();
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();
  
  const lang = pathname.split('/')[1] || 'en';

  const handleSignOut = async () => {
    if (auth) {
      await auth.signOut();
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push(`/${lang}/`);
    }
  };

  const userRole = user?.customClaims?.role;

  const SidebarContent = () => (
    <>
      <div className="flex-1 overflow-y-auto">
        <nav className="space-y-2 p-4">
          {navItems.map((item) => {
            const href = `/${lang}${item.href}`;
            const Icon = item.icon;
            return (
                <Button
                  key={item.href}
                  asChild
                  variant={pathname.startsWith(href) ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-base"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href={href}>
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Link>
                </Button>
            );
          })}

          {userRole === 'admin' && adminNavItems.map((item) => {
              const href = `/${lang}${item.href}`;
              const Icon = item.icon;
              return (
                  <Button
                    key={item.href}
                    asChild
                    variant={pathname.startsWith(href) ? 'secondary' : 'ghost'}
                    className="w-full justify-start text-base"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href={href}>
                      <Icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Link>
                  </Button>
              );
          })}
          
          {guideNavItems.map((item) => {
              const href = `/${lang}${item.href}`;
              const Icon = QrCode;
              if (userRole && item.roles.includes(userRole)) {
                return (
                    <Button
                        key={item.href}
                        asChild
                        variant={pathname.startsWith(href) ? 'secondary' : 'ghost'}
                        className="w-full justify-start text-base"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <Link href={href}>
                            <Icon className="mr-3 h-5 w-5" />
                            {item.label}
                        </Link>
                    </Button>
                );
              }
              return null;
          })}
        </nav>
      </div>
      <div className="mt-auto flex flex-col gap-2 border-t p-4">
        {bottomNavItems.map((item) => {
             const href = `/${lang}${item.href}`;
             const Icon = item.icon;
             return (
                 <Button
                    key={item.href}
                    asChild
                     variant={pathname.startsWith(href) ? 'secondary' : 'ghost'}
                     className="w-full justify-start text-base"
                     onClick={() => setIsMobileMenuOpen(false)}
                 >
                    <Link href={href}>
                     <Icon className="mr-3 h-5 w-5" />
                     {item.label}
                    </Link>
                 </Button>
             );
        })}
        <Button variant="ghost" className="w-full justify-start text-base" onClick={handleSignOut}>
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 flex-col border-r bg-card md:flex shrink-0">
        <div className="flex h-20 items-center border-b px-6">
          <Link href={`/${lang}/`} className="flex items-center gap-2 font-semibold">
            <Sprout className="h-7 w-7 text-primary" />
            <span className="font-headline text-xl">Tasting Mallorca</span>
          </Link>
        </div>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="flex w-72 flex-col bg-card p-0">
          <SheetHeader className="flex h-20 flex-row items-center justify-between border-b px-6">
             <SheetTitle className='sr-only'>Main Menu</SheetTitle>
             <Link href={`/${lang}/`} className="flex items-center gap-2 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>
                <Sprout className="h-7 w-7 text-primary" />
                <span className="font-headline text-xl">Tasting Mallorca</span>
            </Link>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
