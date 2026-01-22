
'use server';

import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { findTourById as findTourByIdAction } from "@/app/server-actions/tours/findTours";
import { notFound } from "next/navigation";
import { EditTourClientPage } from "./edit-tour-client-page";
import { Tour } from "@/backend/tours/domain/tour.model";

interface EditTourPageProps {
    params: Promise<{
        tourId: string;
        lang: string;
    }>
}

export default async function EditTourPage({ params }: EditTourPageProps) {
    const { tourId, lang } = await params;
    const result = await findTourByIdAction(tourId);

    if (result.error || !result.data) {
        console.error(result.error);
        return notFound();
    }

    const tour = result.data as Tour;

    return (
        <AdminRouteGuard>
            <EditTourClientPage
                initialData={tour}
                lang={lang}
            />
        </AdminRouteGuard>
    );
}
