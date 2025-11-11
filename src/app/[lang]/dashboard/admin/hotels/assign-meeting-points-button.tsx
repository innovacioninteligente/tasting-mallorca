
'use client';

import { Button } from "@/components/ui/button";
import { Link2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { assignMeetingPoints } from "@/app/server-actions/meeting-points/assignMeetingPoints";
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

export function AssignMeetingPointsButton() {
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleAssign = async () => {
        setIsLoading(true);
        const result = await assignMeetingPoints({});
        setIsLoading(false);

        if (result.error) {
            toast({
                variant: 'destructive',
                title: 'Error en la asignación',
                description: result.error,
            });
        } else {
            toast({
                title: 'Asignación completada',
                description: `${result.data?.updatedCount} hoteles han sido actualizados con su punto de encuentro más cercano.`,
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
                    Asignar Puntos de Encuentro
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Confirmar asignación automática?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción revisará todos los hoteles y les asignará el punto de encuentro
                        más cercano geográficamente basado en sus coordenadas. Este proceso puede
                        realizar múltiples escrituras en la base de datos si hay hoteles sin asignar.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleAssign} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Continuar y Asignar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
