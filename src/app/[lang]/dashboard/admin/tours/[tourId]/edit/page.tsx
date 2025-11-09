
'use server';

import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { TourForm } from "@/app/[lang]/dashboard/admin/tours/new/tour-form";
import { findTourById as findTourByIdAction } from "@/app/server-actions/tours/findTours";
import { notFound } from "next/navigation";
import { TourFormHeader } from "@/app/[lang]/dashboard/admin/tours/new/tour-form-header";

interface EditTourPageProps {
    params: {
        tourId: string;
        lang: string;
    }
}

export default async function EditTourPage({ params }: EditTourPageProps) {
    const result = await findTourByIdAction(params.tourId);

    if (result.error || !result.data) {
        console.error(result.error);
        return notFound();
    }
    
    const tour = result.data;
    const basePath = `/${params.lang}/dashboard/admin/tours`;

    return (
        <AdminRouteGuard>
             <div className="flex flex-col h-full -mx-4 -pb-4 md:-mx-8 md:-pb-8 lg:-mx-10 lg:-pb-10">
                <TourFormHeader
                    isSubmitting={false} // This will be handled by client component state
                    initialData={tour}
                    basePath={basePath}
                    onSubmit={() => {}} // This will be handled by client component state
                />
                <div className="flex-grow overflow-auto px-4 pt-6 md:px-8 lg:px-10">
                    <TourForm initialData={tour} />
                </div>
            </div>
        </AdminRouteGuard>
    );
}

