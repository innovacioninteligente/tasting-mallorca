
'use client';

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { RouteGuard } from "@/components/auth/route-guard";
import { useState } from "react";
import { DashboardLayoutProvider } from "./layout-context";
import { usePathname } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isFormPage = pathname.includes('/tours/new') || pathname.includes('/edit');

  return (
      <RouteGuard>
        <DashboardLayoutProvider value={{ isMobileMenuOpen, setIsMobileMenuOpen }}>
          <div className="flex h-screen max-h-screen overflow-hidden bg-secondary/50">
            <DashboardSidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
            
            <div className="flex flex-1 flex-col overflow-hidden">
                <DashboardHeader />
                <div className={cn(
                    "flex-1 overflow-hidden",
                    !isFormPage && "p-4 md:p-8 lg:p-10"
                )}>
                  {children}
                </div>
            </div>
          </div>
        </DashboardLayoutProvider>
      </RouteGuard>
  );
}
