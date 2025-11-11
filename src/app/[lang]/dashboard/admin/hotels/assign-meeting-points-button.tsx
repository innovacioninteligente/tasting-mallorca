
'use client';

import { Button } from "@/components/ui/button";
import { Link2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { assignMeetingPoints } from "@/app/server-actions/meeting-points/assignMeetingPoints";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
        <Button variant="outline" onClick={handleAssign} disabled={isLoading}>
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Link2 className="mr-2 h-4 w-4" />
            )}
            Asignar Puntos de Encuentro
        </Button>
    );
}
