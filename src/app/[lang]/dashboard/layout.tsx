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
      <div className="flex min-h-screen">
        <DashboardSidebar lang={params.lang} />
        <main className="flex-1 p-4 md:p-8 lg:p-10">{children}</main>
      </div>
    </RouteGuard>
  );
}
