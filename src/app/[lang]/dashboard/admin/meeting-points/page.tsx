
import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { findAllMeetingPoints } from "@/app/server-actions/meeting-points/findMeetingPoints";
import { MeetingPoint } from "@/backend/meeting-points/domain/meeting-point.model";
import { MeetingPointManagementClientPage } from "./meeting-point-management-client-page";

export default async function MeetingPointManagementPage() {
    const result = await findAllMeetingPoints({});

    return (
        <AdminRouteGuard>
            <MeetingPointManagementClientPage
                initialMeetingPoints={result.data as MeetingPoint[] || []}
                error={result.error}
            />
        </AdminRouteGuard>
    );
}
