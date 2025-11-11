
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
import { createHotel } from "@/app/server-actions/hotels/createHotel";
import { updateHotel } from "@/app/server-actions/hotels/updateHotel";
import { useEffect, useState, useMemo } from "react";
import { Loader2, Link2 } from "lucide-react";
import { Hotel } from "@/backend/hotels/domain/hotel.model";
import { MeetingPoint } from "@/backend/meeting-points/domain/meeting-point.model";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre es requerido'),
  address: z.string().nullable().optional(),
  region: z.enum(["North", "East", "South", "West", "Central"], {
      required_error: "La región es requerida"
  }),
  subRegion: z.string().min(1, 'La sub-región es requerida'),
  latitude: z.coerce.number({ required_error: 'La latitud es requerida' }),
  longitude: z.coerce.number({ required_error: 'La longitud es requerida' }),
  assignedMeetingPointId: z.string().optional(),
});

type HotelFormValues = z.infer<typeof formSchema>;

interface HotelFormProps {
    setSheetOpen: (open: boolean) => void;
    initialData?: Hotel | null;
    meetingPoints: MeetingPoint[];
}

export function HotelForm({ setSheetOpen, initialData, meetingPoints }: HotelFormProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const defaultValues = {
        id: undefined,
        name: '',
        address: '',
        region: 'South' as 'South',
        subRegion: '',
        latitude: 0,
        longitude: 0,
        assignedMeetingPointId: undefined,
    };

    const form = useForm<HotelFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    const assignedMeetingPointName = useMemo(() => {
        if (initialData?.assignedMeetingPointId) {
            return meetingPoints.find(mp => mp.id === initialData.assignedMeetingPointId)?.name;
        }
        return null;
    }, [initialData, meetingPoints]);

    useEffect(() => {
        if (initialData) {
            form.reset({
                ...initialData,
                address: initialData.address || '',
                latitude: initialData.latitude,
                longitude: initialData.longitude,
            });
        } else {
            form.reset(defaultValues);
        }
    }, [initialData, form, defaultValues]);

    const onSubmit = async (data: HotelFormValues) => {
        setIsSubmitting(true);
        try {
            let result;
            if (initialData && initialData.id) { // Editing existing hotel
                result = await updateHotel({ ...data, id: initialData.id });
                 if (result.error) throw new Error(result.error);
                toast({
                    title: "Hotel Actualizado",
                    description: "El hotel ha sido actualizado correctamente.",
                });
            } else { // Creating new hotel
                const { id, ...createData } = data;
                result = await createHotel(createData as any);
                if (result.error) throw new Error(result.error);
                toast({
                    title: "Hotel Creado",
                    description: "El nuevo hotel ha sido añadido correctamente.",
                });
            }
           
            router.refresh();
            setSheetOpen(false);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: initialData ? 'Error actualizando el hotel' : 'Error creando el hotel',
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
                            <FormLabel>Nombre del Hotel</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Hotel Palma Center" {...field} />
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
                            <FormLabel>Dirección (Opcional)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Carrer de Felicià Fuster, 4" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
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
                     <FormField
                        control={form.control}
                        name="subRegion"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sub-Región</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Playa de Palma" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="latitude"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Latitud</FormLabel>
                                <FormControl>
                                    <Input type="number" step="any" placeholder="e.g., 39.5696" {...field} />
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
                                    <Input type="number" step="any" placeholder="e.g., 2.6502" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {assignedMeetingPointName && (
                    <FormItem>
                        <FormLabel>Punto de Encuentro Asignado</FormLabel>
                        <div className="flex items-center gap-2 text-sm p-3 bg-secondary/50 rounded-md border border-dashed">
                             <Link2 className="h-4 w-4 text-muted-foreground" />
                             <span className="font-medium">{assignedMeetingPointName}</span>
                        </div>
                    </FormItem>
                )}

                <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                         {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? 'Guardar Cambios' : 'Guardar Hotel'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
