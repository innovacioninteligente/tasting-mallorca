
'use server';

import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { getFirestore } from 'firebase-admin/firestore';
import { adminApp } from "@/firebase/server/config";
import { PrivateTourList } from './private-tour-list';

async function getPrivateTourRequests() {
    try {
        const db = getFirestore(adminApp);
        const snapshot = await db.collection('privateTourRequests').orderBy('submittedAt', 'desc').get();
        if (snapshot.empty) {
            return { data: [] };
        }
        
        const requests = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Convert timestamp to a serializable format (ISO string)
                submittedAt: data.submittedAt.toDate().toISOString(),
                preferredDate: data.preferredDate, // Already a string or null
            };
        });

        return { data: requests };
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
