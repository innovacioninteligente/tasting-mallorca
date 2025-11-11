
'use server';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { findBookings } from "@/app/server-actions/bookings/findBookings";
import { BookingsClientPage } from "./bookings-client-page";
import { Locale } from "@/dictionaries/config";

export default async function BookingsPage({ params }: { params: { lang: Locale }}) {
    const result = await findBookings({});
    
    return (
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
    );
}
