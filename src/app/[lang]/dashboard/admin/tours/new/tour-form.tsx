
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Zod schema based on the Tour entity
const tourFormSchema = z.object({
  title: z.object({
    es: z.string().min(1, "El título en español es requerido."),
    en: z.string().optional(),
    de: z.string().optional(),
    fr: z.string().optional(),
    nl: z.string().optional(),
  }),
  slug: z.object({
    es: z.string().min(1, "El slug en español es requerido."),
    en: z.string().optional(),
    de: z.string().optional(),
    fr: z.string().optional(),
    nl: z.string().optional(),
  }),
  description: z.object({
    es: z.string().min(1, "La descripción corta en español es requerida."),
    en: z.string().optional(),
    de: z.string().optional(),
    fr: z.string().optional(),
    nl: z.string().optional(),
  }),
  overview: z.object({
    es: z.string().min(1, "El resumen en español es requerido."),
    en: z.string().optional(),
    de: z.string().optional(),
    fr: z.string().optional(),
    nl: z.string().optional(),
  }),
  price: z.coerce.number().min(0, "El precio debe ser un número positivo."),
  region: z.enum(["North", "East", "South", "West", "Central"]),
  durationHours: z.coerce.number().min(1, "La duración debe ser al menos 1 hora."),
  isFeatured: z.boolean().default(false),
});

type TourFormValues = z.infer<typeof tourFormSchema>;

export function TourForm() {
  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      isFeatured: false,
      region: "South",
      durationHours: 8,
      price: 0,
      title: { es: '', en: '', de: '', fr: '', nl: '' },
      slug: { es: '', en: '', de: '', fr: '', nl: '' },
      description: { es: '', en: '', de: '', fr: '', nl: '' },
      overview: { es: '', en: '', de: '', fr: '', nl: '' },
    },
  });

  function onSubmit(data: TourFormValues) {
    console.log(data);
    // Here we will call the server action to create the tour
  }

  const langTabs = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'nl', name: 'Nederlands' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="main" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="main">Contenido Principal</TabsTrigger>
            <TabsTrigger value="availability">Disponibilidad y Precio</TabsTrigger>
            <TabsTrigger value="media">Imágenes e Itinerario</TabsTrigger>
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

                {/* Placeholder for dynamic availability periods */}
                <div>
                    <h3 className="text-lg font-medium mb-2">Periodos de Disponibilidad</h3>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                        <p>Aquí podrás añadir y gestionar los rangos de fechas y días de operación del tour.</p>
                        <p className="text-sm">(Funcionalidad próximamente)</p>
                    </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="mt-6">
             <Card>
              <CardHeader><CardTitle>Imágenes e Itinerario</CardTitle></CardHeader>
              <CardContent className="space-y-8">
                 <div>
                    <h3 className="text-lg font-medium mb-2">Imágenes</h3>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                        <p>Aquí podrás subir la imagen principal y la galería de imágenes.</p>
                         <p className="text-sm">(Funcionalidad próximamente)</p>
                    </div>
                </div>
                 <div>
                    <h3 className="text-lg font-medium mb-2">Itinerario</h3>
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
        <Button type="submit" size="lg">Guardar Tour</Button>
      </form>
    </Form>
  );
}
