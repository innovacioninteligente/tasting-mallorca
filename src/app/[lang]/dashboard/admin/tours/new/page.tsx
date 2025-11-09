

'use client';

import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { TourForm } from "./tour-form";

export default function NewTourPage() {
    return (
        <AdminRouteGuard>
            <div className="flex flex-col h-full">
                <TourForm />
            </div>
        </AdminRouteGuard>
    );
}

