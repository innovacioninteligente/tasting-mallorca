'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tour } from "@/backend/tours/domain/tour.model";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface TourListProps {
    tours?: Tour[];
    loading: boolean;
    error?: string;
}

export function TourList({ tours, loading, error }: TourListProps) {
    const pathname = usePathname();

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    if (error) {
        return <p className="text-destructive text-center py-12">Error: {error}</p>;
    }

    if (!tours || tours.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-medium text-muted-foreground">Aún no se han creado tours.</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Haz clic en el botón de arriba para crear tu primer tour.
                </p>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[80px]">Imagen</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Región</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tours.map((tour) => (
                    <TableRow key={tour.id}>
                        <TableCell>
                            <Image
                                src={tour.mainImage}
                                alt={tour.title.es}
                                width={64}
                                height={64}
                                className="rounded-md object-cover aspect-square"
                            />
                        </TableCell>
                        <TableCell className="font-medium">{tour.title.es}</TableCell>
                        <TableCell>
                            <Badge variant={tour.published ? 'default' : 'secondary'}>
                                {tour.published ? 'Publicado' : 'Borrador'}
                            </Badge>
                        </TableCell>
                        <TableCell>{tour.region}</TableCell>
                        <TableCell>€{tour.price}</TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`${pathname}/${tour.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar
                                    </Link>
                                </Button>
                                <Button asChild variant="ghost" size="sm" disabled={!tour.published}>
                                    <Link href={`/tours/${tour.slug.es}`} target="_blank">
                                        <Eye className="mr-2 h-4 w-4" />
                                        Ver
                                    </Link>
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}