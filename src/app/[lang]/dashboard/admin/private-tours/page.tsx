'use server';

import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PrivateTourList } from './private-tour-list';
import { findAllPrivateTourRequests } from "@/backend/private-tours/application/findPrivateTourRequests";
import { FirestorePrivateTourRequestRepository } from "@/backend/private-tours/infrastructure/firestore-private-tour-request.repository";

async function getPrivateTourRequests() {
    try {
        const repository = new FirestorePrivateTourRequestRepository();
        const requests = await findAllPrivateTourRequests(repository);
        
        // Serialize data for client component
        const serializedRequests = requests.map(request => ({
            ...request,
            submittedAt: request.submittedAt.toISOString(),
        }));

        return { data: serializedRequests };

    } catch (error: any) {
        console.error("Error fetching private tour requests:", error);
        return { error: error.message || "Failed to fetch requests." };
    }
}

export default async function PrivateToursAdminPage() {
    const result = await getPrivateTourRequests();
    
    return (
        <AdminRouteGuard>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Private Tour Requests</h1>
                    <p className="text-muted-foreground">
                        View and manage all incoming requests for tailor-made tours.
                    </p>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Incoming Requests ({result.data?.length || 0})</CardTitle>
                    <CardDescription>
                        Here you can see all the private tour requests submitted by customers.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <PrivateTourList
                        requests={result.data}
                        error={result.error}
                    />
                </CardContent>
            </Card>
        </AdminRouteGuard>
    );
}
