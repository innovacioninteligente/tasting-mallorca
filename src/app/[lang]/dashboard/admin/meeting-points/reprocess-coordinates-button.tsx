
'use client';

import { Button } from "@/components/ui/button";
import { Link2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { reprocessAllCoordinates } from "@/app/server-actions/meeting-points/reprocessAllCoordinates";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function ReprocessCoordinatesButton() {
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleReprocess = async () => {
        setIsLoading(true);
        const result = await reprocessAllCoordinates({});
        setIsLoading(false);

        if (result.error) {
            toast({
                variant: 'destructive',
                title: 'Error en el reprocesamiento',
                description: result.error,
            });
        } else {
            toast({
                title: 'Reprocesamiento completado',
                description: `${result.data?.updatedCount} puntos de encuentro han sido actualizados con sus coordenadas.`,
            });
            router.refresh();
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Link2 className="mr-2 h-4 w-4" />
                    )}
                    Reprocesar Coordenadas
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>¿Confirmar reprocesamiento?</AlertDialogTitle>
                <AlertDialogDescription>
                    Esta acción revisará todos los puntos de encuentro en la base de datos.
                    Si a alguno le faltan las coordenadas de latitud o longitud, intentará
                    extraerlas de nuevo desde su URL de Google Maps. Este proceso puede
                    realizar múltiples escrituras en la base de datos.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleReprocess} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Continuar"}
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
