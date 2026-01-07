
'use server';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { findBookings } from "@/app/server-actions/bookings/findBookings";
import { BookingsClientPage } from "./bookings-client-page";
import { Locale } from "@/dictionaries/config";
import { AdminRouteGuard } from "@/components/auth/admin-route-guard";

export default async function BookingsPage(props: { params: Promise<{ lang: Locale }> }) {
    const params = await props.params;
    const result = await findBookings({});

    return (
        <AdminRouteGuard>
            <Card>
                <CardHeader>
                    <CardTitle>Bookings</CardTitle>
                    <CardDescription>
                        View and manage all tour bookings.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <BookingsClientPage
                        initialBookings={result.data || []}
                        error={result.error}
                        lang={params.lang}
                    />
                </CardContent>
            </Card>
        </AdminRouteGuard>
    );
}
