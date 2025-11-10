
'use client';

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { ArrowLeft, Loader2, Circle } from "lucide-react";
import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { Tour } from "@/backend/tours/domain/tour.model";
import { cn } from "@/lib/utils";

interface TourFormHeaderProps {
    isSubmitting: boolean;
    initialData?: Tour;
    basePath: string;
    onSubmit: () => void;
}

export function TourFormHeader({
    isSubmitting,
    initialData,
    basePath,
    onSubmit,
}: TourFormHeaderProps) {
    const { control, formState: { isDirty } } = useFormContext();

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
                <Button 
                    onClick={onSubmit} 
                    size="sm" 
                    disabled={isSubmitting}
                    className={cn(isDirty && "bg-accent text-accent-foreground hover:bg-accent/90")}
                    type="button"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Save Tour'}
                    {isDirty && !isSubmitting && <Circle className="ml-2 h-3 w-3 fill-current" />}
                </Button>
            </div>
        </div>
    );
}
