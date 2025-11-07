'use client';

import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import Link from 'next/link';

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  const lang = pathname.split('/')[1] || 'en';

  useEffect(() => {
    if (loading) return; 

    if (!user) {
      router.push(`/${lang}/signin`);
      return;
    }

    if (user.customClaims?.role === 'admin') {
      setIsAuthorized(true);
    } else {
        setIsAuthorized(false);
    }

  }, [user, loading, router, pathname, lang]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
        <div className="flex h-full w-full items-center justify-center p-8">
            <Card className="max-w-md w-full text-center">
                <CardHeader>
                    <div className="mx-auto bg-destructive/10 text-destructive rounded-full h-16 w-16 flex items-center justify-center mb-4">
                        <ShieldAlert className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-6">
                        You do not have the necessary permissions to access this page. Please contact an administrator if you believe this is an error.
                    </p>
                    <Button asChild>
                        <Link href={`/${lang}/dashboard`}>Go to Dashboard</Link>
                    </Button>
                </CardContent>
            </Card>
      </div>
    )
  }

  return <>{children}</>;
}
