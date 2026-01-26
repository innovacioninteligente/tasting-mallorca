
import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { findAllGuestFeedback } from "@/app/server-actions/feedback/findGuestFeedback";
import { FeedbackManagementClientPage } from "./feedback-management-client-page";
import { GuestFeedback } from "@/backend/feedback/domain/feedback.model";

export default async function GuestFeedbackAdminPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const result = await findAllGuestFeedback({});

    return (
        <AdminRouteGuard>
            <FeedbackManagementClientPage
                initialFeedbacks={result.data as GuestFeedback[] || []}
                error={result.error}
            />
        </AdminRouteGuard>
    );
}
