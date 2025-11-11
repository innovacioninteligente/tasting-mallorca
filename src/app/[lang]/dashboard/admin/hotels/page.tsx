
'use server';

import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { findAllHotels } from "@/app/server-actions/hotels/findHotels";
import { Hotel } from "@/backend/hotels/domain/hotel.model";
import { HotelManagementClientPage } from "./hotel-management-client-page";
import { findAllMeetingPoints } from "@/app/server-actions/meeting-points/findMeetingPoints";
import { MeetingPoint } from "@/backend/meeting-points/domain/meeting-point.model";

export default async function HotelManagementPage({ params }: { params: { lang: string }}) {
    const hotelsResult = await findAllHotels({});
    const meetingPointsResult = await findAllMeetingPoints({});
    
    return (
        <AdminRouteGuard>
            <HotelManagementClientPage
                initialHotels={hotelsResult.data as Hotel[] || []}
                meetingPoints={meetingPointsResult.data as MeetingPoint[] || []}
                error={hotelsResult.error || meetingPointsResult.error}
            />
        </AdminRouteGuard>
    );
}
