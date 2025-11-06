'use client';

import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    if (loading) return; 

    if (!user) {
      const lang = pathname.split('/')[1] || 'en';
      router.push(`/${lang}/signin`);
    } else {
      setIsRedirecting(false);
    }
  }, [user, loading, router, pathname]);

  if (loading || isRedirecting) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
