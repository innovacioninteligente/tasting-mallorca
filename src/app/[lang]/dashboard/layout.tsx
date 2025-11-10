
'use client';

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { RouteGuard } from "@/components/auth/route-guard";
import { useState } from "react";
import { DashboardLayoutProvider } from "./layout-context";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isTourFormPage = pathname.includes('/tours/new') || pathname.includes('/edit');

  return (
      <RouteGuard>
        <DashboardLayoutProvider value={{ isMobileMenuOpen, setIsMobileMenuOpen }}>
          <div className="flex h-screen max-h-screen overflow-hidden bg-secondary/50">
            <DashboardSidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
            <main className={
              `flex-1 overflow-y-scroll ${isTourFormPage ? 'p-0' : 'px-4 pb-4 pt-8 md:px-8 md:pb-8 lg:px-10 lg:pb-10'}`
            }>
              {children}
            </main>
          </div>
        </DashboardLayoutProvider>
      </RouteGuard>
  );
}
