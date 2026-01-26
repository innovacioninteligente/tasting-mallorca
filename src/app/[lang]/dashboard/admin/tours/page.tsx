
import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from 'next/link';
import { TourList } from "./tour-list";
import { findAllTours } from "@/app/server-actions/tours/findTours";
import { Tour } from "@/backend/tours/domain/tour.model";

export default async function TourManagementPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const createTourLink = `/${lang}/dashboard/admin/tours/new`;
    const result = await findAllTours({});

    return (
        <AdminRouteGuard>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Gestión de Tours</h1>
                    <p className="text-muted-foreground">
                        Crea, edita y gestiona todos los tours de la plataforma.
                    </p>
                </div>
                <Button asChild>
                    <Link href={createTourLink}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Crear Nuevo Tour
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Tours Existentes</CardTitle>
                    <CardDescription>
                        Aquí puedes ver y gestionar todos los tours existentes.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <TourList tours={result.data as Tour[]} error={result.error} />
                </CardContent>
            </Card>
        </AdminRouteGuard>
    );
}
