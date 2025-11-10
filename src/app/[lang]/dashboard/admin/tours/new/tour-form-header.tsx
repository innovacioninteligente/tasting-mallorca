
'use client';

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { ArrowLeft, Loader2, Languages } from "lucide-react";
import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { Tour } from "@/backend/tours/domain/tour.model";

interface TourFormHeaderProps {
    isSubmitting: boolean;
    initialData?: Tour;
    basePath: string;
    onSubmit: () => void;
    onTranslate: () => void;
    isTranslating: boolean;
}

export function TourFormHeader({
    isSubmitting,
    initialData,
    basePath,
    onSubmit,
    onTranslate,
    isTranslating,
}: TourFormHeaderProps) {
    const { control } = useFormContext();

    return (
        <div className="sticky top-0 z-10 flex h-20 items-center justify-between border-b bg-background/95 px-8 py-4 backdrop-blur-sm">
            <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="sm">
                    <Link href={basePath}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to All Tours
                    </Link>
                </Button>
                <h1 className="text-xl font-semibold tracking-tight">
                    {initialData ? 'Edit Tour' : 'Create New Tour'}
                </h1>
            </div>
            <div className="flex items-center gap-4">
                 <Button onClick={onTranslate} variant="outline" size="sm" disabled={isTranslating || isSubmitting}>
                    {isTranslating ? <Loader2 className="animate-spin mr-2" /> : <Languages className="mr-2 h-4 w-4" />}
                    Translate with AI
                </Button>
                <FormField
                    control={control}
                    name="published"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <FormLabel className="text-base font-normal">
                                {field.value ? 'Published' : 'Draft'}
                            </FormLabel>
                        </FormItem>
                    )}
                />
                <Button onClick={onSubmit} size="sm" disabled={isSubmitting || isTranslating}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Save Tour'}
                </Button>
            </div>
        </div>
    );
}
