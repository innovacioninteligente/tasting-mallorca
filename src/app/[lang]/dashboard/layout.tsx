
'use client';

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { RouteGuard } from "@/components/auth/route-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
      <RouteGuard>
        <div className="flex h-screen max-h-screen overflow-hidden bg-secondary/50">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto px-4 pb-4 md:px-8 md:pb-8 lg:px-10 lg:pb-10">
            {children}
          </main>
        </div>
      </RouteGuard>
  );
}
