
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Star, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { GuestFeedback, GuestFeedbackSchema, GuestFeedbackFormValues } from "@/backend/feedback/domain/feedback.model";
import { createGuestFeedback } from "@/app/server-actions/feedback/createGuestFeedback";
import { updateGuestFeedback } from "@/app/server-actions/feedback/updateGuestFeedback";

interface FeedbackFormProps {
    setSheetOpen: (open: boolean) => void;
    initialData?: GuestFeedback | null;
}

export function FeedbackForm({ setSheetOpen, initialData }: FeedbackFormProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rating, setRating] = useState(initialData?.rating || 0);

    const form = useForm<GuestFeedbackFormValues>({
        resolver: zodResolver(GuestFeedbackSchema),
        defaultValues: {
            name: '',
            nationality: '',
            experience: '',
            photoUrl: '',
            published: false,
            isFeatured: false,
            rating: 0,
        }
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                ...initialData,
                tourDate: parseISO(initialData.tourDate),
            });
            setRating(initialData.rating);
        } else {
            form.reset({
                name: '',
                nationality: '',
                experience: '',
                photoUrl: '',
                published: false,
                isFeatured: false,
                rating: 0,
                tourDate: new Date(),
            });
            setRating(0);
        }
    }, [initialData, form]);
    
    useEffect(() => {
        form.setValue('rating', rating);
    }, [rating, form]);

    const onSubmit = async (data: GuestFeedbackFormValues) => {
        setIsSubmitting(true);
        try {
            let result;
            if (initialData && initialData.id) {
                result = await updateGuestFeedback({ ...data, id: initialData.id });
                if (result.error) throw new Error(result.error);
                toast({
                    title: "Opinión Actualizada",
                    description: "La opinión ha sido actualizada correctamente.",
                });
            } else {
                result = await createGuestFeedback(data);
                if (result.error) throw new Error(result.error);
                toast({
                    title: "Opinión Creada",
                    description: "La nueva opinión ha sido añadida correctamente.",
                });
            }
           
            router.refresh();
            setSheetOpen(false);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: initialData ? 'Error actualizando' : 'Error creando',
                description: error.message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
                
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre del Autor</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                 <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nacionalidad</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., British" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="tourDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Fecha del Tour</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value, "PPP") : <span>Elige una fecha</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormItem>
                    <FormLabel>Rating</FormLabel>
                     <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={cn(
                                    "w-6 h-6 text-muted-foreground/30 cursor-pointer transition-colors",
                                    rating >= star && "text-yellow-400 fill-yellow-400"
                                )}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>
                    <FormMessage>{form.formState.errors.rating?.message}</FormMessage>
                </FormItem>


                <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Texto de la Opinión</FormLabel>
                            <FormControl>
                                <Textarea rows={6} placeholder="Describe la experiencia del cliente..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                 <FormField
                    control={form.control}
                    name="photoUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL de la Foto (Opcional)</FormLabel>
                            <FormControl>
                                <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-4">
                     <FormField
                        control={form.control}
                        name="published"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Publicado</FormLabel>
                            </div>
                            <FormControl>
                                <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isFeatured"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Destacado</FormLabel>
                            </div>
                            <FormControl>
                                <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            </FormItem>
                        )}
                    />
                </div>


                <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                         {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? 'Guardar Cambios' : 'Crear Opinión'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
