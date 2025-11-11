
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MeetingPoint } from "@/backend/meeting-points/domain/meeting-point.model";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ExternalLink, CheckCircle, AlertTriangle } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

interface MeetingPointListProps {
    meetingPoints?: MeetingPoint[];
    error?: string;
    onEdit: (point: MeetingPoint) => void;
}

export function MeetingPointList({ meetingPoints, error, onEdit }: MeetingPointListProps) {
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
                    <TableHead>Estado de Coordenadas</TableHead>
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
                            {point.latitude && point.longitude ? (
                                <Badge variant="outline" className="text-green-600 border-green-300">
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Obtenidas
                                </Badge>
                            ) : (
                                <Badge variant="destructive" className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-100">
                                     <AlertTriangle className="mr-2 h-4 w-4" />
                                    Pendientes
                                </Badge>
                            )}
                        </TableCell>
                         <TableCell>
                            <a href={point.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                                Ver en Google Maps <ExternalLink className="h-4 w-4" />
                            </a>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => onEdit(point)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
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
