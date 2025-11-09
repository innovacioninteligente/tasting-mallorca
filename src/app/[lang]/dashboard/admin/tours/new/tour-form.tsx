
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createTour } from "@/app/server-actions/tours/createTour";
import { updateTour } from "@/app/server-actions/tours/updateTour";
import { useToast } from "@/hooks/use-toast";
import { useRouter, usePathname } from "next/navigation";
import { ImageUpload } from "./image-upload";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { DateRange } from "react-day-picker";
import { addDays, format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { initializeFirebase } from "@/firebase";
import { Tour } from "@/backend/tours/domain/tour.model";
import { TourFormHeader } from "./tour-form-header";
import { UploadProgressDialog } from "@/components/upload-progress-dialog";

const multilingualStringSchema = z.object({
    es: z.string().min(1, { message: "El texto en español es requerido." }),
    en: z.string().optional(),
    de: z.string().optional(),
    fr: z.string().optional(),
    nl: z.string().optional(),
});

const availabilityPeriodSchema = z.object({
    startDate: z.date({ required_error: "Start date is required." }),
    endDate: z.date({ required_error: "End date is required." }),
    activeDays: z.array(z.string()).min(1, "At least one active day is required."),
});

const formSchema = z.object({
  title: multilingualStringSchema,
  slug: multilingualStringSchema,
  description: multilingualStringSchema,
  overview: multilingualStringSchema,
  generalInfo: z.object({
    cancellationPolicy: multilingualStringSchema,
    bookingPolicy: multilingualStringSchema,
    guideInfo: multilingualStringSchema,
    pickupInfo: multilingualStringSchema,
  }),
  price: z.coerce.number().min(0, "El precio debe ser un número positivo."),
  region: z.enum(["North", "East", "South", "West", "Central"]),
  durationHours: z.coerce.number().min(1, "La duración debe ser al menos 1 hora."),
  isFeatured: z.boolean().default(false),
  published: z.boolean().default(false),
  mainImage: z.any().refine(val => val, "La imagen principal es requerida."),
  galleryImages: z.any().optional(),
  allowDeposit: z.boolean().default(false),
  depositPrice: z.coerce.number().optional(),
  availabilityPeriods: z.array(availabilityPeriodSchema).optional(),
}).refine(data => {
    if (data.allowDeposit) {
        return data.depositPrice !== undefined && data.depositPrice > 0;
    }
    return true;
}, {
    message: "El precio del depósito es requerido si se permiten depósitos.",
    path: ["depositPrice"],
}).refine(data => {
    if (data.allowDeposit && data.depositPrice) {
        return data.depositPrice < data.price;
    }
    return true;
}, {
    message: "El depósito no puede ser mayor o igual al precio total.",
    path: ["depositPrice"],
});

type TourFormValues = z.infer<typeof formSchema>;

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const weekDayInitials = ["L", "M", "X", "J", "V", "S", "D"];

function AvailabilityPeriodCreator({ onAddPeriod }: { onAddPeriod: (period: z.infer<typeof availabilityPeriodSchema>) => void }) {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: new Date(), to: addDays(new Date(), 20) });
    const [activeDays, setActiveDays] = useState<string[]>([]);
    const [showCreator, setShowCreator] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSavePeriod = () => {
        if (!dateRange?.from || !dateRange?.to) {
            setError("Debes seleccionar un rango de fechas.");
            return;
        }
        if (activeDays.length === 0) {
            setError("Debes seleccionar al menos un día activo.");
            return;
        }
        onAddPeriod({ startDate: dateRange.from, endDate: dateRange.to, activeDays });
        setDateRange({ from: new Date(), to: addDays(new Date(), 20) });
        setActiveDays([]);
        setError(null);
        setShowCreator(false);
    };

    const handleToggleAllWeek = () => {
        if (activeDays.length === weekDays.length) {
            setActiveDays([]);
        } else {
            setActiveDays(weekDays);
        }
    };

    if (!showCreator) {
        return (
            <Button type="button" variant="outline" onClick={() => setShowCreator(true)} className="mt-4 w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Nuevo Periodo de Disponibilidad
            </Button>
        );
    }

    return (
        <Card className="mt-4 bg-secondary/50 border-dashed">
            <CardContent className="p-4 space-y-4">
                <div>
                    <FormLabel>Rango de Fechas</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn("w-full justify-start text-left font-normal mt-1", !dateRange && "text-muted-foreground")}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange?.from ? (
                                    dateRange.to ? (
                                        <>
                                            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(dateRange.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Selecciona un rango</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange?.from}
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div>
                    <FormLabel>Días Activos</FormLabel>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        <ToggleGroup type="multiple" value={activeDays} onValueChange={setActiveDays} variant="outline" className="flex-wrap justify-start">
                            {weekDays.map((day, index) => (
                                <ToggleGroupItem
                                    key={day}
                                    value={day}
                                    aria-label={`Toggle ${day}`}
                                    className="w-10 h-10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                                >
                                    {weekDayInitials[index]}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                        <Button type="button" variant="link" size="sm" onClick={handleToggleAllWeek} className="px-2">
                           Toda la semana
                        </Button>
                    </div>
                </div>
                {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                <div className="flex gap-2 justify-end">
                    <Button type="button" variant="ghost" onClick={() => setShowCreator(false)}>Cancelar</Button>
                    <Button type="button" onClick={handleSavePeriod}>Guardar Periodo</Button>
                </div>
            </CardContent>
        </Card>
    );
}

interface TourFormProps {
  initialData?: Tour;
}

export function TourForm({ initialData }: TourFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('Starting...');
  const [tourId, setTourId] = useState<string | undefined>(initialData?.id);
  const basePath = pathname.split('/').slice(0, -2).join('/');
  
  const defaultValues: Partial<TourFormValues> = {
      title: initialData?.title || { es: '', en: '', de: '', fr: '', nl: '' },
      slug: initialData?.slug || { es: '', en: '', de: '', fr: '', nl: '' },
      description: initialData?.description || { es: '', en: '', de: '', fr: '', nl: '' },
      overview: initialData?.overview || { es: '', en: '', de: '', fr: '', nl: '' },
      generalInfo: initialData?.generalInfo || {
        cancellationPolicy: { es: '', en: '', de: '', fr: '', nl: '' },
        bookingPolicy: { es: '', en: '', de: '', fr: '', nl: '' },
        guideInfo: { es: '', en: '', de: '', fr: '', nl: '' },
        pickupInfo: { es: '', en: '', de: '', fr: '', nl: '' },
      },
      price: initialData?.price || 0,
      region: initialData?.region || "South",
      durationHours: initialData?.durationHours || 8,
      isFeatured: initialData?.isFeatured || false,
      published: initialData?.published || false,
      allowDeposit: initialData?.allowDeposit || false,
      depositPrice: initialData?.depositPrice || 0,
      availabilityPeriods: initialData?.availabilityPeriods?.map(p => ({
        ...p,
        startDate: parseISO(p.startDate),
        endDate: parseISO(p.endDate)
      })) || [],
      mainImage: initialData?.mainImage,
      galleryImages: initialData?.galleryImages || [],
  };

  const form = useForm<TourFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "availabilityPeriods",
  });

  const allowDeposit = form.watch("allowDeposit");

 const uploadFile = (file: File, currentTourId: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const { app } = initializeFirebase();
        const storage = getStorage(app);
        const fileName = `tours/${currentTourId}/${Date.now()}-${file.name}`;
        const fileRef = storageRef(storage, fileName);
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error("Upload failed:", error);
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(resolve);
            }
        );
    });
  };

 async function onSubmit(data: TourFormValues) {
    setIsSubmitting(true);

    try {
        let currentTourId = tourId;
        if (!tourId) {
            currentTourId = crypto.randomUUID();
            setTourId(currentTourId);
        }

        let mainImageUrl = data.mainImage;
        if (data.mainImage instanceof File) {
            setUploadMessage('Subiendo imagen principal...');
            mainImageUrl = await uploadFile(data.mainImage, currentTourId!);
        }

        let galleryImageUrls: string[] = [];
        const existingGalleryUrls = (data.galleryImages as any[])?.filter(img => typeof img === 'string') || [];
        const newGalleryFiles = (data.galleryImages as any[])?.filter(img => img instanceof File) || [];
        
        if (newGalleryFiles.length > 0) {
            const uploadedUrls: string[] = [];
            for (let i = 0; i < newGalleryFiles.length; i++) {
                setUploadMessage(`Subiendo imagen de galería ${i + 1} de ${newGalleryFiles.length}...`);
                const url = await uploadFile(newGalleryFiles[i], currentTourId!);
                uploadedUrls.push(url);
            }
            galleryImageUrls = [...existingGalleryUrls, ...uploadedUrls];
        } else {
            galleryImageUrls = existingGalleryUrls;
        }

        setUploadMessage('Guardando datos del tour...');
        setUploadProgress(100);

        const tourData = {
            ...data,
            mainImage: mainImageUrl,
            galleryImages: galleryImageUrls,
            availabilityPeriods: data.availabilityPeriods?.map(p => ({
                ...p,
                startDate: format(p.startDate, 'yyyy-MM-dd'),
                endDate: format(p.endDate, 'yyyy-MM-dd')
            }))
        };
        
        let result;
        if (initialData?.id || tourId) { 
            result = await updateTour({ ...tourData, id: tourId! });
        } else { 
            result = await createTour({ ...tourData, id: currentTourId! });
        }

        if (result.error) throw new Error(result.error);
        
        if (!initialData?.id) {
            const newPath = `${basePath}/${currentTourId}/edit`;
            router.replace(newPath, { scroll: false });
        }

        toast({
            title: "¡Tour Guardado!",
            description: `El tour "${data.title.es}" ha sido guardado exitosamente.`,
        });

    } catch (error: any) {
        console.error("Error saving tour:", error);
        toast({
            variant: "destructive",
            title: "Error al guardar el tour",
            description: error.message || "Ocurrió un problema, por favor intenta de nuevo.",
        });
    } finally {
        setIsSubmitting(false);
    }
}

  const langTabs = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'nl', name: 'Nederlands' },
  ];

  return (
    <>
      {isSubmitting && <UploadProgressDialog progress={uploadProgress} message={uploadMessage} />}
      <FormProvider {...form}>
        <TourFormHeader
          isSubmitting={isSubmitting}
          initialData={initialData}
          basePath={basePath}
          onSubmit={form.handleSubmit(onSubmit)}
        />
        <div className="flex-grow overflow-auto px-4 pt-6 md:px-8 lg:px-10">
          <Form {...form}>
              <form className="space-y-8">
                  <div className="pt-2">
                      <Tabs defaultValue="main" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="main">Contenido e Imágenes</TabsTrigger>
                          <TabsTrigger value="availability">Disponibilidad y Precio</TabsTrigger>
                          <TabsTrigger value="itinerary">Itinerario</TabsTrigger>
                          <TabsTrigger value="translations">Traducciones</TabsTrigger>
                      </TabsList>

                      <TabsContent value="main" className="mt-6">
                          <Card>
                          <CardHeader>
                              <CardTitle>Contenido Principal (Español)</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                              <FormField
                              control={form.control}
                              name="title.es"
                              render={({ field }) => (
                                  <FormItem>
                                  <FormLabel>Título del Tour</FormLabel>
                                  <FormControl><Input placeholder="Ej: Vistas de Tramuntana y Corazón de la Isla" {...field} /></FormControl>
                                  <FormMessage />
                                  </FormItem>
                              )}
                              />
                              <FormField
                              control={form.control}
                              name="slug.es"
                              render={({ field }) => (
                                  <FormItem>
                                  <FormLabel>Slug (URL amigable)</FormLabel>
                                  <FormControl><Input placeholder="ej-vistas-tramuntana-corazon-isla" {...field} /></FormControl>
                                  <FormDescription>Esto formará parte de la URL. Usar solo letras minúsculas, números y guiones.</FormDescription>
                                  <FormMessage />
                                  </FormItem>
                              )}
                              />
                              <FormField
                              control={form.control}
                              name="description.es"
                              render={({ field }) => (
                                  <FormItem>
                                  <FormLabel>Descripción Corta (para tarjetas)</FormLabel>
                                  <FormControl><Textarea rows={3} {...field} /></FormControl>
                                  <FormMessage />
                                  </FormItem>
                              )}
                              />
                              <FormField
                              control={form.control}
                              name="overview.es"
                              render={({ field }) => (
                                  <FormItem>
                                  <FormLabel>Descripción General (página de detalle)</FormLabel>
                                  <FormControl><Textarea rows={6} {...field} /></FormControl>
                                  <FormMessage />
                                  </FormItem>
                              )}
                              />
                          </CardContent>
                          </Card>

                           <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Información General (Español)</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="generalInfo.cancellationPolicy.es"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Política de Cancelación</FormLabel>
                                                <FormControl><Textarea rows={2} placeholder="Ej: Cancela hasta 24 horas antes para un reembolso completo" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="generalInfo.bookingPolicy.es"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Política de Reserva</FormLabel>
                                                <FormControl><Textarea rows={2} placeholder="Ej: Planes flexibles: reserva tu plaza inmediatamente, sin que se te cobre hoy." {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="generalInfo.guideInfo.es"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Información del Guía</FormLabel>
                                                <FormControl><Textarea rows={1} placeholder="Ej: Inglés, Alemán, Francés, Neerlandés" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="generalInfo.pickupInfo.es"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Información de Recogida</FormLabel>
                                                <FormControl><Textarea rows={4} placeholder="Describe los detalles del servicio de recogida..." {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                          <Card className="mt-6">
                              <CardHeader>
                                  <CardTitle>Imágenes del Tour</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-8">
                                  <FormField
                                      control={form.control}
                                      name="mainImage"
                                      render={({ field }) => (
                                          <FormItem>
                                              <FormLabel>Imagen Principal</FormLabel>
                                              <FormDescription>Esta es la imagen que se mostrará en las tarjetas de tours.</FormDescription>
                                              <FormControl>
                                                  <ImageUpload
                                                      value={field.value ? [field.value] : []}
                                                      onChange={(file) => field.onChange(file)}
                                                      onRemove={() => field.onChange(undefined)}
                                                      multiple={false}
                                                  />
                                              </FormControl>
                                              <FormMessage />
                                          </FormItem>
                                      )}
                                      />
                                  <FormField
                                      control={form.control}
                                      name="galleryImages"
                                      render={({ field }) => (
                                          <FormItem>
                                              <FormLabel>Galería de Imágenes</FormLabel>
                                              <FormDescription>Estas imágenes se mostrarán en la página de detalle del tour.</FormDescription>
                                              <FormControl>
                                                  <ImageUpload
                                                      value={field.value || []}
                                                      onChange={(files) => field.onChange(files)}
                                                      onRemove={(fileToRemove) => {
                                                          const newValue = [...(field.value || [])].filter(file => file !== fileToRemove);
                                                          field.onChange(newValue);
                                                      }}
                                                      multiple={true}
                                                  />
                                              </FormControl>
                                              <FormMessage />
                                          </FormItem>
                                      )}
                                      />
                              </CardContent>
                          </Card>
                      </TabsContent>

                      <TabsContent value="availability" className="mt-6">
                          <Card>
                          <CardHeader><CardTitle>Disponibilidad y Precios</CardTitle></CardHeader>
                          <CardContent className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <FormField
                                  control={form.control}
                                  name="price"
                                  render={({ field }) => (
                                      <FormItem>
                                      <FormLabel>Precio Base (€)</FormLabel>
                                      <FormControl><Input type="number" placeholder="Ej: 120" {...field} /></FormControl>
                                      <FormMessage />
                                      </FormItem>
                                  )}
                                  />
                                  <FormField
                                  control={form.control}
                                  name="durationHours"
                                  render={({ field }) => (
                                      <FormItem>
                                      <FormLabel>Duración (horas)</FormLabel>
                                      <FormControl><Input type="number" placeholder="Ej: 8" {...field} /></FormControl>
                                      <FormMessage />
                                      </FormItem>
                                  )}
                                  />
                                  <FormField
                                      control={form.control}
                                      name="region"
                                      render={({ field }) => (
                                          <FormItem>
                                          <FormLabel>Región del Tour</FormLabel>
                                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                                              <FormControl>
                                              <SelectTrigger><SelectValue placeholder="Selecciona una región" /></SelectTrigger>
                                              </FormControl>
                                              <SelectContent>
                                                  <SelectItem value="North">Norte</SelectItem>
                                                  <SelectItem value="East">Este</SelectItem>
                                                  <SelectItem value="South">Sur</SelectItem>
                                                  <SelectItem value="West">Oeste</SelectItem>
                                                  <SelectItem value="Central">Central</SelectItem>
                                              </SelectContent>
                                          </Select>
                                          <FormMessage />
                                          </FormItem>
                                      )}
                                      />
                              </div>
                              <FormField
                                  control={form.control}
                                  name="isFeatured"
                                  render={({ field }) => (
                                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                      <div className="space-y-0.5">
                                          <FormLabel className="text-base">Tour Destacado</FormLabel>
                                          <FormDescription>Marcar si este tour debe aparecer en la página de inicio.</FormDescription>
                                      </div>
                                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                      </FormItem>
                                  )}
                                  />
                              <FormField
                                  control={form.control}
                                  name="allowDeposit"
                                  render={({ field }) => (
                                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                      <div className="space-y-0.5">
                                          <FormLabel className="text-base">Permitir reserva con depósito</FormLabel>
                                          <FormDescription>Permitir a los clientes pagar un depósito para reservar, y el resto en el lugar.</FormDescription>
                                      </div>
                                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                      </FormItem>
                                  )}
                                  />
                              {allowDeposit && (
                                  <FormField
                                      control={form.control}
                                      name="depositPrice"
                                      render={({ field }) => (
                                          <FormItem>
                                              <FormLabel>Precio del Depósito (€)</FormLabel>
                                              <FormControl><Input type="number" placeholder="Ej: 20" {...field} /></FormControl>
                                              <FormDescription>El cliente pagará esta cantidad para reservar. El resto se paga en el lugar.</FormDescription>
                                              <FormMessage />
                                          </FormItem>
                                      )}
                                      />
                              )}
                              <div>
                              <h3 className="text-lg font-medium mb-2">Periodos de Disponibilidad</h3>
                              <FormMessage>{form.formState.errors.availabilityPeriods?.root?.message}</FormMessage>
                              <div className="space-y-3">
                                  {fields.map((field, index) => (
                                  <Card key={field.id} className="bg-secondary/30">
                                      <CardContent className="p-3 flex justify-between items-center">
                                      <div>
                                          <p className="font-semibold">{format(field.startDate, "dd/MM/yy")} - {format(field.endDate, "dd/MM/yy")}</p>
                                          <div className="flex gap-1 mt-1">
                                          {weekDays.map((day, i) => (
                                              <span key={day} className={cn("text-xs w-6 h-6 flex items-center justify-center rounded-full", field.activeDays.includes(day) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                                                  {weekDayInitials[i]}
                                              </span>
                                          ))}
                                          </div>
                                      </div>
                                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                          <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                      </CardContent>
                                  </Card>
                                  ))}
                              </div>

                              <AvailabilityPeriodCreator onAddPeriod={(period) => append(period)} />
                              <FormMessage>{form.formState.errors.availabilityPeriods?.message}</FormMessage>
                              </div>
                          </CardContent>
                          </Card>
                      </TabsContent>

                      <TabsContent value="itinerary" className="mt-6">
                          <Card>
                          <CardHeader><CardTitle>Itinerario del Tour</CardTitle></CardHeader>
                          <CardContent className="space-y-8">
                              <div>
                                  <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                                      <p>Aquí podrás definir las paradas y actividades del itinerario del tour.</p>
                                      <p className="text-sm">(Funcionalidad próximamente)</p>
                                  </div>
                              </div>
                          </CardContent>
                          </Card>
                      </TabsContent>

                      <TabsContent value="translations" className="mt-6">
                          <Card>
                              <CardHeader><CardTitle>Traducciones</CardTitle></CardHeader>
                              <CardContent>
                                  <Tabs defaultValue="en" className="w-full">
                                      <TabsList className="grid w-full grid-cols-4">
                                          {langTabs.map(lang => <TabsTrigger key={lang.code} value={lang.code}>{lang.name}</TabsTrigger>)}
                                      </TabsList>
                                      {langTabs.map(lang => (
                                          <TabsContent key={lang.code} value={lang.code} className="mt-4 space-y-4">
                                              <FormField
                                                  control={form.control}
                                                  name={`title.${lang.code as 'en' | 'de' | 'fr' | 'nl'}`}
                                                  render={({ field }) => (
                                                      <FormItem>
                                                      <FormLabel>Título ({lang.code.toUpperCase()})</FormLabel>
                                                      <FormControl><Input {...field} /></FormControl>
                                                      <FormMessage />
                                                      </FormItem>
                                                  )}
                                              />
                                              <FormField
                                                  control={form.control}
                                                  name={`description.${lang.code as 'en' | 'de' | 'fr' | 'nl'}`}
                                                  render={({ field }) => (
                                                      <FormItem>
                                                      <FormLabel>Descripción Corta ({lang.code.toUpperCase()})</FormLabel>
                                                      <FormControl><Textarea rows={2} {...field} /></FormControl>
                                                      <FormMessage />
                                                      </FormItem>
                                                  )}
                                              />
                                              <FormField
                                                  control={form.control}
                                                  name={`overview.${lang.code as 'en' | 'de' | 'fr' | 'nl'}`}
                                                  render={({ field }) => (
                                                      <FormItem>
                                                      <FormLabel>Descripción General ({lang.code.toUpperCase()})</FormLabel>
                                                      <FormControl><Textarea rows={5} {...field} /></FormControl>
                                                      <FormMessage />
                                                      </FormItem>
                                                  )}
                                              />
                                               <FormField
                                                    control={form.control}
                                                    name={`generalInfo.cancellationPolicy.${lang.code as 'en' | 'de' | 'fr' | 'nl'}`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Política de Cancelación ({lang.code.toUpperCase()})</FormLabel>
                                                            <FormControl><Textarea rows={2} {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`generalInfo.bookingPolicy.${lang.code as 'en' | 'de' | 'fr' | 'nl'}`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Política de Reserva ({lang.code.toUpperCase()})</FormLabel>
                                                            <FormControl><Textarea rows={2} {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`generalInfo.guideInfo.${lang.code as 'en' | 'de' | 'fr' | 'nl'}`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Información del Guía ({lang.code.toUpperCase()})</FormLabel>
                                                            <FormControl><Textarea rows={1} {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`generalInfo.pickupInfo.${lang.code as 'en' | 'de' | 'fr' | 'nl'}`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Información de Recogida ({lang.code.toUpperCase()})</FormLabel>
                                                            <FormControl><Textarea rows={4} {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                              <FormField
                                                  control={form.control}
                                                  name={`slug.${lang.code as 'en' | 'de' | 'fr' | 'nl'}`}
                                                  render={({ field }) => (
                                                      <FormItem>
                                                      <FormLabel>Slug ({lang.code.toUpperCase()})</FormLabel>
                                                      <FormControl><Input {...field} /></FormControl>
                                                      <FormMessage />
                                                      </FormItem>
                                                  )}
                                              />
                                          </TabsContent>
                                      ))}
                                  </Tabs>
                              </CardContent>
                          </Card>
                      </TabsContent>
                      </Tabs>
                  </div>
              </form>
          </Form>
        </div>
      </FormProvider>
    </>
  );
}
