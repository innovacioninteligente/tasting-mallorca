
'use server';

import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PlusCircle, Link2 } from "lucide-react";
import Link from 'next/link';
import { findAllHotels } from "@/app/server-actions/hotels/findHotels";
import { Hotel } from "@/backend/hotels/domain/hotel.model";
import { HotelList } from "./hotel-list";
import { AssignMeetingPointsButton } from "./assign-meeting-points-button";

export default async function HotelManagementPage({ params }: { params: { lang: string }}) {
    const createHotelLink = `/${params.lang}/dashboard/admin/hotels/new`;
    const result = await findAllHotels({});
    
    return (
        <AdminRouteGuard>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Gestión de Hoteles</h1>
                    <p className="text-muted-foreground">
                        Crea, edita y gestiona todos los hoteles.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <AssignMeetingPointsButton />
                    <Button asChild>
                        <Link href={createHotelLink}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Crear Nuevo Hotel
                        </Link>
                    </Button>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Hoteles Existentes</CardTitle>
                     <CardDescription>
                        Aquí puedes ver y gestionar todos los hoteles existentes.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <HotelList hotels={result.data as Hotel[]} error={result.error} />
                </CardContent>
            </Card>
        </AdminRouteGuard>
    );
}
