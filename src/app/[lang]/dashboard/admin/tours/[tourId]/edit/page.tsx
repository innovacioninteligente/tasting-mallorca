'use server';

import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { TourForm } from "../new/tour-form";
import { findTourById } from "@/backend/tours/application/findTours";
import { FirestoreTourRepository } from "@/backend/tours/infrastructure/firestore-tour.repository";

interface EditTourPageProps {
    params: {
        tourId: string;
    }
}

export default async function EditTourPage({ params }: EditTourPageProps) {
    const tourRepository = new FirestoreTourRepository();
    const tour = await findTourById(tourRepository, params.tourId);

    if (!tour) {
        return (
            <AdminRouteGuard>
                <div className="flex flex-col items-center justify-center h-full">
                    <h1 className="text-2xl font-bold">Tour no encontrado</h1>
                    <p className="text-muted-foreground">No se pudo encontrar un tour con el ID proporcionado.</p>
                </div>
            </AdminRouteGuard>
        );
    }
    
    // The tour object is converted to a plain object to avoid Next.js serialization issues.
    const plainTour = JSON.parse(JSON.stringify(tour));

    return (
        <AdminRouteGuard>
            <div className="flex flex-col h-full -mx-4 -pb-4 md:-mx-8 md:-pb-8 lg:-mx-10 lg:-pb-10">
                <TourForm initialData={plainTour} />
            </div>
        </AdminRouteGuard>
    );
}