
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { MeetingPoint } from "@/backend/meeting-points/domain/meeting-point.model";
import { MeetingPointList } from "./meeting-point-list";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { MeetingPointForm } from "./meeting-point-form";

interface MeetingPointManagementClientPageProps {
    initialMeetingPoints: MeetingPoint[];
    error?: string;
}

export function MeetingPointManagementClientPage({ initialMeetingPoints, error }: MeetingPointManagementClientPageProps) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingPoint, setEditingPoint] = useState<MeetingPoint | null>(null);

    const handleCreate = () => {
        setEditingPoint(null);
        setIsSheetOpen(true);
    }

    const handleEdit = (point: MeetingPoint) => {
        setEditingPoint(point);
        setIsSheetOpen(true);
    }
    
    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Gestión de Puntos de Encuentro</h1>
                    <p className="text-muted-foreground">
                        Crea, edita y gestiona todos los puntos de encuentro para los tours.
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Crear Nuevo Punto
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Puntos de Encuentro Existentes ({initialMeetingPoints.length})</CardTitle>
                     <CardDescription>
                        Aquí puedes ver y gestionar todos los puntos de encuentro disponibles.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <MeetingPointList
                        meetingPoints={initialMeetingPoints}
                        error={error}
                        onEdit={handleEdit}
                    />
                </CardContent>
            </Card>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-xl">
                    <SheetHeader>
                        <SheetTitle>{editingPoint ? 'Editar Punto de Encuentro' : 'Crear Nuevo Punto'}</SheetTitle>
                        <SheetDescription>
                           {editingPoint
                                ? "Modifica los detalles del punto de encuentro. Haz clic en guardar cuando hayas terminado."
                                : "Rellena los detalles del nuevo punto. Haz clic en guardar cuando hayas terminado."
                           }
                        </SheetDescription>
                    </SheetHeader>
                    <MeetingPointForm
                        setSheetOpen={setIsSheetOpen}
                        initialData={editingPoint}
                    />
                </SheetContent>
            </Sheet>
        </>
    );
}
