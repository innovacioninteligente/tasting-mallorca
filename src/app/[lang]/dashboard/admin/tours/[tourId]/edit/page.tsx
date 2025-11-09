
'use server';

import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { TourForm } from "@/app/[lang]/dashboard/admin/tours/new/tour-form";
import { findTourById as findTourByIdAction } from "@/app/server-actions/tours/findTours";
import { notFound } from "next/navigation";

interface EditTourPageProps {
    params: {
        tourId: string;
    }
}

export default async function EditTourPage({ params }: EditTourPageProps) {
    const result = await findTourByIdAction(params.tourId);

    if (result.error || !result.data) {
        console.error(result.error);
        return notFound();
    }
    
    // The tour object is already a plain object from the server action.
    const tour = result.data;

    return (
        <AdminRouteGuard>
            <div className="flex flex-col h-full -mx-4 -pb-4 md:-mx-8 md:-pb-8 lg:-mx-10 lg:-pb-10">
                <TourForm initialData={tour} />
            </div>
        </AdminRouteGuard>
    );
}
