'use client';

import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { TourForm } from "./tour-form";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TourFormHeader } from "./tour-form-header";
import { useState } from "react";
import { Tour } from "@/backend/tours/domain/tour.model";

// Duplicating schema and types for now to avoid circular dependencies
// In a real app, this would be in a shared file.
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

const itineraryItemSchema = z.object({
    id: z.string(),
    type: z.enum(["stop", "travel"]),
    icon: z.string(),
    duration: z.string().min(1, "La duración es requerida."),
    title: multilingualStringSchema,
    activities: z.object({
        es: z.array(z.string()).optional(),
        en: z.array(z.string()).optional(),
        de: z.array(z.string()).optional(),
        fr: z.array(z.string()).optional(),
        nl: z.array(z.string()).optional(),
    }),
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
  itinerary: z.array(itineraryItemSchema).optional(),
});


export default function NewTourPage({ initialData }: { initialData?: Tour }) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
             title: { es: '', en: '', de: '', fr: '', nl: '' },
            slug: { es: '', en: '', de: '', fr: '', nl: '' },
            description: { es: '', en: '', de: '', fr: '', nl: '' },
            overview: { es: '', en: '', de: '', fr: '', nl: '' },
            generalInfo: {
                cancellationPolicy: { es: '', en: '', de: '', fr: '', nl: '' },
                bookingPolicy: { es: '', en: '', de: '', fr: '', nl: '' },
                guideInfo: { es: '', en: '', de: '', fr: '', nl: '' },
                pickupInfo: { es: '', en: '', de: '', fr: '', nl: '' },
            },
            price: 0,
            region: "South",
            durationHours: 8,
            isFeatured: false,
            published: false,
            allowDeposit: false,
            itinerary: [],
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const basePath = '/dashboard/admin/tours';

    return (
        <AdminRouteGuard>
            <div className="flex flex-col h-full -mx-4 -pb-4 md:-mx-8 md:-pb-8 lg:-mx-10 lg:-pb-10">
                <FormProvider {...form}>
                    <TourFormHeader
                        isSubmitting={isSubmitting}
                        initialData={initialData}
                        basePath={basePath}
                        onSubmit={form.handleSubmit((data) => console.log(data))} // Pass the handler
                    />
                    <div className="flex-grow overflow-auto px-4 pt-6 md:px-8 lg:px-10">
                       <TourForm initialData={initialData} />
                    </div>
                </FormProvider>
            </div>
        </AdminRouteGuard>
    );
}
