'use client';

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { RouteGuard } from "@/components/auth/route-guard";

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {

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
