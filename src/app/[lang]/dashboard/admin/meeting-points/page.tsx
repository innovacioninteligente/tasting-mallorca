
'use server';

import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from 'next/link';
import { findAllMeetingPoints } from "@/app/server-actions/meeting-points/findMeetingPoints";
import { MeetingPoint } from "@/backend/meeting-points/domain/meeting-point.model";
import { MeetingPointList } from "./meeting-point-list";

export default async function MeetingPointManagementPage({ params }: { params: { lang: string }}) {
    const createMeetingPointLink = `/${params.lang}/dashboard/admin/meeting-points/new`;
    const result = await findAllMeetingPoints({});
    
    return (
        <AdminRouteGuard>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Gestión de Puntos de Encuentro</h1>
                    <p className="text-muted-foreground">
                        Crea, edita y gestiona todos los puntos de encuentro para los tours.
                    </p>
                </div>
                <Button asChild>
                    <Link href={createMeetingPointLink}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Crear Nuevo Punto
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Puntos de Encuentro Existentes</CardTitle>
                     <CardDescription>
                        Aquí puedes ver y gestionar todos los puntos de encuentro disponibles.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <MeetingPointList meetingPoints={result.data as MeetingPoint[]} error={result.error} />
                </CardContent>
            </Card>
        </AdminRouteGuard>
    );
}
