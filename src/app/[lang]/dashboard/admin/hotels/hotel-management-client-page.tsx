
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Hotel } from "@/backend/hotels/domain/hotel.model";
import { HotelList } from "./hotel-list";
import { AssignMeetingPointsButton } from "./assign-meeting-points-button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { HotelForm } from "./hotel-form";

interface HotelManagementClientPageProps {
    initialHotels: Hotel[];
    error?: string;
}

export function HotelManagementClientPage({ initialHotels, error }: HotelManagementClientPageProps) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    
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
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Crear Nuevo Hotel
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="sm:max-w-xl">
                            <SheetHeader>
                                <SheetTitle>Crear Nuevo Hotel</SheetTitle>
                                <SheetDescription>
                                    Rellena los detalles del nuevo hotel. Haz clic en guardar cuando hayas terminado.
                                </SheetDescription>
                            </SheetHeader>
                            <HotelForm setSheetOpen={setIsSheetOpen} />
                        </SheetContent>
                    </Sheet>
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
                    <HotelList hotels={initialHotels} error={error} />
                </CardContent>
            </Card>
        </>
    );
}
