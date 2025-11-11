
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PlusCircle, Upload } from "lucide-react";
import { Hotel } from "@/backend/hotels/domain/hotel.model";
import { HotelList } from "./hotel-list";
import { AssignMeetingPointsButton } from "./assign-meeting-points-button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { HotelForm } from "./hotel-form";
import { CsvImporter } from "./csv-importer/csv-importer";
import { MeetingPoint } from "@/backend/meeting-points/domain/meeting-point.model";

interface HotelManagementClientPageProps {
    initialHotels: Hotel[];
    meetingPoints: MeetingPoint[];
    error?: string;
}

export function HotelManagementClientPage({ initialHotels, meetingPoints, error }: HotelManagementClientPageProps) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isImportSheetOpen, setIsImportSheetOpen] = useState(false);
    const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

    const handleCreate = () => {
        setEditingHotel(null);
        setIsSheetOpen(true);
    }

    const handleEdit = (hotel: Hotel) => {
        setEditingHotel(hotel);
        setIsSheetOpen(true);
    }
    
    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Gestión de Hoteles</h1>
                    <p className="text-muted-foreground">
                        Crea, edita y gestiona todos los hoteles.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <AssignMeetingPointsButton />
                     <Sheet open={isImportSheetOpen} onOpenChange={setIsImportSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline">
                                <Upload className="mr-2 h-4 w-4" />
                                Importar desde CSV
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="sm:max-w-2xl">
                            <SheetHeader>
                                <SheetTitle>Importar Hoteles desde CSV</SheetTitle>
                                <SheetDescription>
                                    Sigue los pasos para subir tu archivo CSV y mapear las columnas a la base de datos.
                                </SheetDescription>
                            </SheetHeader>
                            <CsvImporter setSheetOpen={setIsImportSheetOpen} />
                        </SheetContent>
                    </Sheet>
                    <Button onClick={handleCreate}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Crear Nuevo Hotel
                    </Button>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Hoteles Existentes ({initialHotels.length})</CardTitle>
                     <CardDescription>
                        Aquí puedes ver y gestionar todos los hoteles existentes.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <HotelList
                        hotels={initialHotels}
                        meetingPoints={meetingPoints}
                        error={error}
                        onEdit={handleEdit}
                    />
                </CardContent>
            </Card>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-xl">
                    <SheetHeader>
                        <SheetTitle>{editingHotel ? 'Editar Hotel' : 'Crear Nuevo Hotel'}</SheetTitle>
                        <SheetDescription>
                           {editingHotel 
                                ? "Modifica los detalles del hotel. Haz clic en guardar cuando hayas terminado."
                                : "Rellena los detalles del nuevo hotel. Haz clic en guardar cuando hayas terminado."
                           }
                        </SheetDescription>
                    </SheetHeader>
                    <HotelForm 
                        setSheetOpen={setIsSheetOpen} 
                        initialData={editingHotel}
                        meetingPoints={meetingPoints}
                    />
                </SheetContent>
            </Sheet>
        </>
    );
}
