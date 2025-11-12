
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { FeedbackForm } from "./feedback-form";
import { GuestFeedback } from "@/backend/feedback/domain/feedback.model";
import { FeedbackList } from "./feedback-list";

interface FeedbackManagementClientPageProps {
    initialFeedbacks: GuestFeedback[];
    error?: string;
}

export function FeedbackManagementClientPage({ initialFeedbacks, error }: FeedbackManagementClientPageProps) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingFeedback, setEditingFeedback] = useState<GuestFeedback | null>(null);

    const handleCreate = () => {
        setEditingFeedback(null);
        setIsSheetOpen(true);
    }

    const handleEdit = (feedback: GuestFeedback) => {
        setEditingFeedback(feedback);
        setIsSheetOpen(true);
    }
    
    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Gestión de Feedback</h1>
                    <p className="text-muted-foreground">
                        Gestiona, publica y destaca las opiniones de los clientes.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleCreate}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Añadir Feedback Manualmente
                    </Button>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Opiniones de Clientes ({initialFeedbacks.length})</CardTitle>
                     <CardDescription>
                        Aquí puedes ver y gestionar todas las opiniones enviadas.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FeedbackList
                        feedbacks={initialFeedbacks}
                        error={error}
                        onEdit={handleEdit}
                    />
                </CardContent>
            </Card>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-xl overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>{editingFeedback ? 'Editar Opinión' : 'Añadir Nueva Opinión'}</SheetTitle>
                        <SheetDescription>
                           {editingFeedback 
                                ? "Modifica los detalles de la opinión. Haz clic en guardar cuando hayas terminado."
                                : "Rellena los detalles de la nueva opinión. Haz clic en guardar cuando hayas terminado."
                           }
                        </SheetDescription>
                    </SheetHeader>
                    <FeedbackForm 
                        setSheetOpen={setIsSheetOpen} 
                        initialData={editingFeedback}
                    />
                </SheetContent>
            </Sheet>
        </>
    );
}
