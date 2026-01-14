
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Star, CheckCircle, Eye } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import { format } from "date-fns";
import { GuestFeedback } from "@/backend/feedback/domain/feedback.model";
import { deleteGuestFeedback } from "@/app/server-actions/feedback/deleteGuestFeedback";

interface FeedbackListProps {
    feedbacks?: GuestFeedback[];
    error?: string;
    onEdit: (feedback: GuestFeedback) => void;
}

export function FeedbackList({ feedbacks, error, onEdit }: FeedbackListProps) {
    const router = useRouter();
    const { toast } = useToast();

    if (error) {
        return <p className="text-destructive text-center py-12">Error: {error}</p>;
    }

    if (!feedbacks || feedbacks.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-medium text-muted-foreground">Aún no hay opiniones.</h3>
            </div>
        );
    }

    const handleDelete = async (feedbackId: string) => {
        const result = await deleteGuestFeedback(feedbackId);
        if (result.error) {
            toast({
                variant: 'destructive',
                title: 'Error eliminando la opinión',
                description: result.error,
            });
        } else {
            toast({
                title: 'Opinión eliminada',
                description: 'La opinión ha sido eliminada correctamente.',
            });
            router.refresh();
        }
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[80px]">Foto</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha del Tour</TableHead>
                    <TableHead>Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {feedbacks.map((feedback) => (
                    <TableRow key={feedback.id}>
                        <TableCell>
                            {feedback.photoUrl ? (
                                <ImageWithSkeleton
                                    src={feedback.photoUrl}
                                    alt={`Photo by ${feedback.name}`}
                                    width={64}
                                    height={64}
                                    className="rounded-md object-cover aspect-square"
                                />
                            ) : (
                                <div className="w-16 h-16 bg-secondary rounded-md flex items-center justify-center">
                                    <Eye className="h-6 w-6 text-muted-foreground" />
                                </div>
                            )}
                        </TableCell>
                        <TableCell className="font-medium">{feedback.name}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                {feedback.rating}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col gap-2">
                                <Badge variant={feedback.published ? 'default' : 'secondary'}>
                                    {feedback.published ? 'Publicado' : 'Borrador'}
                                </Badge>
                                {feedback.isFeatured && (
                                    <Badge variant="outline" className="text-accent border-accent/50">
                                        <CheckCircle className="mr-1.5 h-3 w-3" />
                                        Destacado
                                    </Badge>
                                )}
                            </div>
                        </TableCell>
                        <TableCell>{format(new Date(feedback.tourDate), "PPP")}</TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => onEdit(feedback)}>
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
                                                Esta acción no se puede deshacer. Se eliminará permanentemente esta opinión.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(feedback.id)}>
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
        </Table >
    );
}
