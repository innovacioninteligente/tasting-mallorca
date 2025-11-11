
'use server';

import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { findAllHotels } from "@/app/server-actions/hotels/findHotels";
import { Hotel } from "@/backend/hotels/domain/hotel.model";
import { HotelManagementClientPage } from "./hotel-management-client-page";

export default async function HotelManagementPage({ params }: { params: { lang: string }}) {
    const result = await findAllHotels({});
    
    return (
        <AdminRouteGuard>
            <HotelManagementClientPage
                initialHotels={result.data as Hotel[] || []}
                error={result.error}
            />
        </AdminRouteGuard>
    );
}
