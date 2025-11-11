
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createMeetingPoint } from "@/app/server-actions/meeting-points/createMeetingPoint";
import { updateMeetingPoint } from "@/app/server-actions/meeting-points/updateMeetingPoint";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { MeetingPoint } from "@/backend/meeting-points/domain/meeting-point.model";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre es requerido'),
  address: z.string().min(1, 'La dirección es requerida'),
  region: z.enum(["North", "East", "South", "West", "Central"], {
      required_error: "La región es requerida"
  }),
  googleMapsUrl: z.string().url('Debe ser una URL de Google Maps válida'),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

type MeetingPointFormValues = z.infer<typeof formSchema>;

interface MeetingPointFormProps {
    setSheetOpen: (open: boolean) => void;
    initialData?: MeetingPoint | null;
}

export function MeetingPointForm({ setSheetOpen, initialData }: MeetingPointFormProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<MeetingPointFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: undefined,
            name: '',
            address: '',
            region: 'South',
            googleMapsUrl: '',
            latitude: undefined,
            longitude: undefined,
        }
    });

    useEffect(() => {
        if (initialData) {
            form.reset(initialData);
        } else {
            form.reset({
                id: undefined,
                name: '',
                address: '',
                region: 'South',
                googleMapsUrl: '',
                latitude: undefined,
                longitude: undefined,
            });
        }
    }, [initialData, form]);

    const onSubmit = async (data: MeetingPointFormValues) => {
        setIsSubmitting(true);
        try {
            let result;
            if (initialData && initialData.id) { // Editing existing point
                result = await updateMeetingPoint({ ...data, id: initialData.id });
                 if (result.error) throw new Error(result.error);
                toast({
                    title: "Punto de Encuentro Actualizado",
                    description: "El punto de encuentro ha sido actualizado correctamente.",
                });
            } else { // Creating new point
                const { id, ...createData } = data;
                result = await createMeetingPoint(createData as any);
                if (result.error) throw new Error(result.error);
                toast({
                    title: "Punto de Encuentro Creado",
                    description: "El nuevo punto de encuentro ha sido añadido correctamente.",
                });
            }
           
            router.refresh();
            setSheetOpen(false);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: initialData ? 'Error actualizando el punto' : 'Error creando el punto',
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
                            <FormLabel>Nombre del Punto de Encuentro</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Catedral de Palma - Puerta Principal" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Dirección</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Plaça de la Seu, s/n, 07001 Palma" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="googleMapsUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL de Google Maps</FormLabel>
                            <FormControl>
                                <Input placeholder="https://maps.app.goo.gl/..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="latitude"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Latitud</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} value={field.value ?? ''} readOnly className="bg-muted/50" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="longitude"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Longitud</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} value={field.value ?? ''} readOnly className="bg-muted/50" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Región</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Selecciona una región" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="North">Norte</SelectItem>
                                    <SelectItem value="East">Este</SelectItem>
                                    <SelectItem value="South">Sur</SelectItem>
                                    <SelectItem value="West">Oeste</SelectItem>
                                    <SelectItem value="Central">Centro</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                         {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? 'Guardar Cambios' : 'Guardar Punto'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
