
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MeetingPoint } from "@/backend/meeting-points/domain/meeting-point.model";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { useToast } from "@/hooks/use-toast";
import { deleteMeetingPoint } from "@/app/server-actions/meeting-points/deleteMeetingPoint";
import { useRouter } from "next/navigation";

interface MeetingPointListProps {
    meetingPoints?: MeetingPoint[];
    error?: string;
}

export function MeetingPointList({ meetingPoints, error }: MeetingPointListProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { toast } = useToast();
    
    if (error) {
        return <p className="text-destructive text-center py-12">Error: {error}</p>;
    }

    if (!meetingPoints || meetingPoints.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-medium text-muted-foreground">Aún no se han añadido puntos de encuentro.</h3>
            </div>
        );
    }

    const handleDelete = async (pointId: string) => {
        const result = await deleteMeetingPoint(pointId);
        if (result.error) {
            toast({
                variant: 'destructive',
                title: 'Error eliminando el punto de encuentro',
                description: result.error,
            });
        } else {
            toast({
                title: 'Punto de encuentro eliminado',
                description: 'El punto de encuentro ha sido eliminado correctamente.',
            });
            router.refresh();
        }
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Región</TableHead>
                    <TableHead>Enlace a Maps</TableHead>
                    <TableHead>Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {meetingPoints.map((point) => (
                    <TableRow key={point.id}>
                        <TableCell className="font-medium">{point.name}</TableCell>
                        <TableCell>{point.region}</TableCell>
                         <TableCell>
                            <a href={point.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                                Ver en Google Maps <ExternalLink className="h-4 w-4" />
                            </a>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`${pathname}/${point.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar
                                    </Link>
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Eliminar
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta acción no se puede deshacer. Se eliminará permanentemente el punto de encuentro.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(point.id)}>
                                            Continuar
                                        </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
