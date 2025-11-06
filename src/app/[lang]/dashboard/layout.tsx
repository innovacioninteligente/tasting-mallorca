import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { RouteGuard } from "@/components/auth/route-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-8 lg:p-10">{children}</main>
      </div>
    </RouteGuard>
  );
}
