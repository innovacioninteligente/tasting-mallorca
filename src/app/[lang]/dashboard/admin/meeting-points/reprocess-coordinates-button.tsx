
'use client';

import { Button } from "@/components/ui/button";
import { Link2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { reprocessAllCoordinates } from "@/app/server-actions/meeting-points/reprocessAllCoordinates";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
        <Button variant="outline" onClick={handleReprocess} disabled={isLoading}>
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Link2 className="mr-2 h-4 w-4" />
            )}
            Reprocesar Coordenadas
        </Button>
    );
}
