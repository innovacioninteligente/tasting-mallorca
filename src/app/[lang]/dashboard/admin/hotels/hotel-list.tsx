
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Hotel } from "@/backend/hotels/domain/hotel.model";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
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
import { deleteHotel } from "@/app/server-actions/hotels/deleteHotel";
import { useRouter } from "next/navigation";

interface HotelListProps {
    hotels?: Hotel[];
    error?: string;
    onEdit: (hotel: Hotel) => void;
}

export function HotelList({ hotels, error, onEdit }: HotelListProps) {
    const router = useRouter();
    const { toast } = useToast();
    
    if (error) {
        return <p className="text-destructive text-center py-12">Error: {error}</p>;
    }

    if (!hotels || hotels.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-medium text-muted-foreground">Aún no se han añadido hoteles.</h3>
            </div>
        );
    }

    const handleDelete = async (hotelId: string) => {
        const result = await deleteHotel(hotelId);
        if (result.error) {
            toast({
                variant: 'destructive',
                title: 'Error eliminando el hotel',
                description: result.error,
            });
        } else {
            toast({
                title: 'Hotel eliminado',
                description: 'El hotel ha sido eliminado correctamente.',
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
                    <TableHead>Sub-Región</TableHead>
                    <TableHead>Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {hotels.map((hotel) => (
                    <TableRow key={hotel.id}>
                        <TableCell className="font-medium">{hotel.name}</TableCell>
                        <TableCell>{hotel.region}</TableCell>
                        <TableCell>{hotel.subRegion}</TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => onEdit(hotel)}>
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
                                            Esta acción no se puede deshacer. Se eliminará permanentemente el hotel de la base de datos.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(hotel.id)}>
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
