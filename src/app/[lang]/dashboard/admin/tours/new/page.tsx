
'use client';

import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { TourForm } from "./tour-form";

export default function NewTourPage() {
    return (
        <AdminRouteGuard>
            <TourForm />
        </AdminRouteGuard>
    );
}
