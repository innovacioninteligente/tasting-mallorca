'use client';

import { TourForm } from "@/app/[lang]/dashboard/admin/tours/new/tour-form";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TourFormHeader } from "@/app/[lang]/dashboard/admin/tours/new/tour-form-header";
import { useState } from "react";
import { Tour } from "@/backend/tours/domain/tour.model";
import { parseISO } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { initializeFirebase } from "@/firebase";
import { updateTour } from "@/app/server-actions/tours/updateTour";
import { createTour } from "@/app/server-actions/tours/createTour";
import { useFormPersistence } from "@/hooks/use-form-persistence";

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

const pickupPointSchema = z.object({
    title: multilingualStringSchema,
    description: multilingualStringSchema,
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
  id: z.string(),
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
  pickupPoint: pickupPointSchema,
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

interface EditTourClientPageProps {
    initialData: Tour;
    lang: string;
}

export function EditTourClientPage({ initialData, lang }: EditTourClientPageProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadMessage, setUploadMessage] = useState('Starting...');

    const formPersistenceKey = `tour-form-edit-${initialData.id}`;
    
    // The dates come as strings from the server action, so we need to parse them.
    const parsedInitialData = {
        ...initialData,
        availabilityPeriods: initialData.availabilityPeriods?.map(p => ({
            ...p,
            startDate: parseISO(p.startDate),
            endDate: parseISO(p.endDate)
        })) || [],
        mainImage: initialData.mainImage,
        galleryImages: initialData.galleryImages || [],
        itinerary: initialData.itinerary || [],
        pickupPoint: initialData.pickupPoint || { title: { es: '' }, description: { es: '' } },
    };

    const form = useForm<TourFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: parsedInitialData,
    });

    const { clearPersistedData } = useFormPersistence(formPersistenceKey, form, parsedInitialData);

    const uploadFile = (file: File, tourId: string): Promise<string> => {
      return new Promise((resolve, reject) => {
          const { app } = initializeFirebase();
          const storage = getStorage(app);
          const fileName = `tours/${tourId}/${Date.now()}-${file.name}`;
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

    const onSubmit = async (data: TourFormValues) => {
        setIsSubmitting(true);
        const basePath = `/${lang}/dashboard/admin/tours`;
    
        try {
            let tourId = data.id;
    
            let mainImageUrl = data.mainImage;
            if (data.mainImage instanceof File) {
                setUploadMessage('Subiendo imagen principal...');
                mainImageUrl = await uploadFile(data.mainImage, tourId!);
            }
    
            let galleryImageUrls: string[] = [];
            const existingGalleryUrls = (data.galleryImages as any[])?.filter(img => typeof img === 'string') || [];
            const newGalleryFiles = (data.galleryImages as any[])?.filter(img => img instanceof File) || [];
            
            if (newGalleryFiles.length > 0) {
                const uploadedUrls: string[] = [];
                for (let i = 0; i < newGalleryFiles.length; i++) {
                    setUploadMessage(`Subiendo imagen de galería ${i + 1} de ${newGalleryFiles.length}...`);
                    const url = await uploadFile(newGalleryFiles[i], tourId!);
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
                    startDate: p.startDate.toISOString().split('T')[0],
                    endDate: p.endDate.toISOString().split('T')[0]
                }))
            };
            
            const result = await updateTour({ ...tourData, id: tourId });
    
            if (result.error) throw new Error(result.error);

            clearPersistedData();
    
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
    };
    
    const basePath = `/${lang}/dashboard/admin/tours`;

    return (
        <div className="flex flex-col h-full -mx-4 -pb-4 md:-mx-8 md:-pb-8 lg:-px-10 lg:-pb-10">
            <FormProvider {...form}>
                <TourFormHeader
                    isSubmitting={isSubmitting}
                    initialData={initialData}
                    basePath={basePath}
                    onSubmit={form.handleSubmit(onSubmit)}
                />
                <div className="flex-grow overflow-auto px-4 pt-6 md:px-8 lg:px-10">
                   <TourForm
                     initialData={initialData}
                     isSubmitting={isSubmitting}
                     uploadProgress={uploadProgress}
                     uploadMessage={uploadMessage}
                    />
                </div>
            </FormProvider>
        </div>
    );
}
