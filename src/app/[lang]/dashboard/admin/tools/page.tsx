import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import MigrationPageClient from "./page-client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "System Tools | Admin Dashboard",
    description: "Maintenance tools and scripts."
};

export default function ToolsPage() {
    return (
        <AdminRouteGuard>
            <MigrationPageClient />
        </AdminRouteGuard>
    );
}
