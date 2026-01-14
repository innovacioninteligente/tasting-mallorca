
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tour } from "@/backend/tours/domain/tour.model";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Loader2, Trash2, ImageIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
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
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { deleteTour } from "@/app/server-actions/tours/deleteTour";
import { useState } from "react";
import { UploadProgressDialog } from "@/components/upload-progress-dialog";

interface TourListProps {
    tours?: Tour[];
    error?: string;
}

export function TourList({ tours, error }: TourListProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { toast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleDelete = async (tourId: string) => {
        setIsDeleting(true);
        const result = await deleteTour(tourId);
        setIsDeleting(false);

        if (result.error) {
            toast({
                variant: 'destructive',
                title: 'Error deleting tour',
                description: result.error,
            });
        } else {
            toast({
                title: 'Tour Deleted',
                description: 'The tour has been successfully deleted.',
            });
            router.refresh();
        }
    }

    return (
        <>
            {isDeleting && <UploadProgressDialog progress={100} message="Eliminando tour y sus imágenes..." />}
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
                                {tour.mainImage ? (
                                    <ImageWithSkeleton
                                        src={tour.mainImage}
                                        alt={tour.title.en}
                                        width={64}
                                        height={64}
                                        className="rounded-md object-cover aspect-square"
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-secondary rounded-md flex items-center justify-center">
                                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                )}
                            </TableCell>
                            <TableCell className="font-medium">{tour.title.en}</TableCell>
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
                                        <Link href={`/tours/${tour.slug.en}`} target="_blank">
                                            <Eye className="mr-2 h-4 w-4" />
                                            Ver
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
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the tour and all associated images from the servers.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(tour.id)} disabled={isDeleting}>
                                                    {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Continue
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table >
        </>
    );
}
