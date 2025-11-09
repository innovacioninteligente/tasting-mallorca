
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
          <main className="flex-1 overflow-auto p-4 md:p-8 lg:p-10">
            {children}
          </main>
        </div>
      </RouteGuard>
  );
}
