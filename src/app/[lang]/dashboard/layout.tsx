'use client';

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { RouteGuard } from "@/components/auth/route-guard";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const pathname = usePathname();

  // Do not render Header and Footer on dashboard routes
  if (pathname.includes('/dashboard')) {
    return (
        <RouteGuard>
          <div className="flex min-h-screen bg-secondary/50">
            <DashboardSidebar lang={params.lang} />
            <main className="flex-1 overflow-auto p-4 md:p-8 lg:p-10">
              {children}
            </main>
          </div>
        </RouteGuard>
    );
  }

  // Default layout for other pages remains unchanged in the root layout
  return <>{children}</>;
}
