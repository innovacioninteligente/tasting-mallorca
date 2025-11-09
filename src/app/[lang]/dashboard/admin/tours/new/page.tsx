'use client';

import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { TourForm } from "./tour-form";

export default function NewTourPage() {
    return (
        <AdminRouteGuard>
            <div className="flex flex-col h-full -mx-4 -pb-4 md:-mx-8 md:-pb-8 lg:-mx-10 lg:-pb-10">
                <TourForm />
            </div>
        </AdminRouteGuard>
    );
}