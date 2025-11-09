
'use client';

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { Tour } from "@/backend/tours/domain/tour.model";

interface TourFormHeaderProps {
    isSubmitting: boolean;
    uploadProgress: number;
    initialData?: Tour;
    basePath: string;
    onSubmit: () => void;
}

export function TourFormHeader({
    isSubmitting,
    uploadProgress,
    initialData,
    basePath,
    onSubmit,
}: TourFormHeaderProps) {
    const { control } = useFormContext();

    return (
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 py-4 backdrop-blur-sm -mx-4 px-4 md:-mx-8 md:px-8 lg:-mx-10 lg:px-10">
            <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="sm">
                    <Link href={basePath}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a Todos los Tours
                    </Link>
                </Button>
                <h1 className="text-xl font-semibold tracking-tight">
                    {initialData ? 'Editar Tour' : 'Crear un Nuevo Tour'}
                </h1>
            </div>
            <div className="flex items-center gap-4">
                <FormField
                    control={control}
                    name="published"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <FormLabel className="text-base font-normal">
                                {field.value ? 'Publicado' : 'Borrador'}
                            </FormLabel>
                        </FormItem>
                    )}
                />
                <Button onClick={onSubmit} size="sm" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Guardar Tour'}
                </Button>
            </div>
        </div>
    );
}

