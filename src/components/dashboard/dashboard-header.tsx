
'use client';

import { Button } from '@/components/ui/button';
import { Menu, Sprout } from 'lucide-react';
import { useDashboardLayout } from '@/app/[lang]/dashboard/layout-context';
import { usePathname } from 'next/navigation';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import Link from 'next/link';

function getPageTitle(pathname: string): string {
    const segments = pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    if (!lastSegment || segments.length < 3) return 'Dashboard';
    if (lastSegment === 'dashboard' && segments[2] !== 'dashboard') return 'Dashboard';
    if (lastSegment === 'edit') return 'Edit Tour';

    // Capitalize first letter and replace dashes with spaces
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, ' ');
}


export function DashboardHeader() {
  const { setIsMobileMenuOpen } = useDashboardLayout();
  const { user } = useUser();
  const pathname = usePathname();
  const lang = pathname.split('/')[1] || 'en';
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-8">
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open Menu</span>
        </Button>
      </div>

      <div className="flex w-full items-center justify-between">
        <h1 className="text-xl font-semibold hidden md:block">{pageTitle}</h1>
        <div className="md:hidden">
             <Link href={`/${lang}/`} className="flex items-center gap-2 font-semibold">
                <Sprout className="h-6 w-6 text-primary" />
                <span className="font-headline text-lg">Tasting Mallorca</span>
            </Link>
        </div>
        
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                    <AvatarFallback>{user?.displayName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={`/${lang}/dashboard/profile`}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={`/${lang}/dashboard/settings`}>Settings</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
