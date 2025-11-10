
'use client';

import { TourForm } from "@/app/[lang]/dashboard/admin/tours/new/tour-form";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TourFormHeader } from "@/app/./[lang]/dashboard/admin/tours/new/tour-form-header";
import { useState } from "react";
import { Tour } from "@/backend/tours/domain/tour.model";
import { parseISO } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { initializeFirebase } from "@/firebase";
import { updateTour } from "@/app/server-actions/tours/updateTour";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import { UploadProgressDialog } from "@/components/upload-progress-dialog";
import { cloneDeep, merge, mergeWith } from "lodash";
import { translateTourAction } from "@/app/server-actions/tours/translateTour";
import { TranslateTourOutput } from "@/ai/flows/translate-tour-flow";


const multilingualStringSchema = z.object({
    es: z.string().optional(),
    en: z.string().min(1, { message: "El texto en inglés es requerido." }),
    de: z.string().optional(),
    fr: z.string().optional(),
    nl: z.string().optional(),
});

const multilingualOptionalStringSchema = z.object({
    es: z.string().optional(),
    en: z.string().optional(),
    de: z.string().optional(),
    fr: z.string().optional(),
    nl: z.string().optional(),
}).optional();

const availabilityPeriodSchema = z.object({
    startDate: z.date({ required_error: "Start date is required." }),
    endDate: z.date({ required_error: "End date is required." }),
    activeDays: z.array(z.string()).min(1, "At least one active day is required."),
});

const pickupPointSchema = z.object({
    title: multilingualStringSchema,
    description: multilingualStringSchema,
});

const detailsSchema = z.object({
    highlights: multilingualOptionalStringSchema,
    fullDescription: multilingualOptionalStringSchema,
    included: multilingualOptionalStringSchema,
    notIncluded: multilingualOptionalStringSchema,
    notSuitableFor: multilingualOptionalStringSchema,
    whatToBring: multilingualOptionalStringSchema,
    beforeYouGo: multilingualOptionalStringSchema,
}).optional();

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
  details: detailsSchema,
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

const defaultMultilingual = { es: '', en: '', de: '', fr: '', nl: '' };

export function EditTourClientPage({ initialData, lang }: EditTourClientPageProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadMessage, setUploadMessage] = useState('Starting...');

    const formPersistenceKey = `tour-form-edit-${initialData.id}`;
    
    // The dates come as strings from the server action, so we need to parse them.
    const parsedInitialData = {
        ...initialData,
        availabilityPeriods: initialData.availabilityPeriods?.map(p => ({
            ...p,
            startDate: p.startDate ? parseISO(p.startDate) : new Date(),
            endDate: p.endDate ? parseISO(p.endDate) : new Date()
        })) || [],
        itinerary: initialData.itinerary?.map(item => ({
            ...item,
            title: { ...defaultMultilingual, ...item.title },
            activities: { 
                en: item.activities?.en || [],
                es: item.activities?.es || [],
                de: item.activities?.de || [],
                fr: item.activities?.fr || [],
                nl: item.activities?.nl || [],
            }
        })) || []
    };
    
    const defaultValues = {
        id: initialData.id || '',
        title: { ...defaultMultilingual },
        slug: { ...defaultMultilingual },
        description: { ...defaultMultilingual },
        overview: { ...defaultMultilingual },
        generalInfo: {
            cancellationPolicy: { ...defaultMultilingual },
            bookingPolicy: { ...defaultMultilingual },
            guideInfo: { ...defaultMultilingual },
            pickupInfo: { ...defaultMultilingual },
        },
        details: {
            highlights: { ...defaultMultilingual },
            fullDescription: { ...defaultMultilingual },
            included: { ...defaultMultilingual },
            notIncluded: { ...defaultMultilingual },
            notSuitableFor: { ...defaultMultilingual },
            whatToBring: { ...defaultMultilingual },
            beforeYouGo: { ...defaultMultilingual },
        },
        pickupPoint: {
            title: { ...defaultMultilingual },
            description: { ...defaultMultilingual },
        },
        price: 0,
        region: "South" as "South",
        durationHours: 8,
        isFeatured: false,
        published: false,
        allowDeposit: false,
        depositPrice: 0,
        itinerary: [],
        galleryImages: [],
        mainImage: undefined,
        availabilityPeriods: [],
    };
    const mergedData = mergeWith(cloneDeep(defaultValues), parsedInitialData, (objValue, srcValue) => {
        if (srcValue !== undefined && srcValue !== null) {
            return srcValue;
        }
        return objValue;
    });

    const form = useForm<TourFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: mergedData,
    });

    const { clearPersistedData } = useFormPersistence(formPersistenceKey, form, mergedData);

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

    const handleInvalidSubmit = () => {
        toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Please review all tabs for required fields and correct any errors.",
        });
    }

    const onSubmit = async (data: TourFormValues) => {
        setIsSubmitting(true);
    
        try {
            let tourId = data.id;
    
            let mainImageUrl = data.mainImage;
            if (data.mainImage instanceof File) {
                setUploadMessage('Uploading main image...');
                mainImageUrl = await uploadFile(data.mainImage, tourId!);
            }
    
            let galleryImageUrls: string[] = [];
            const existingGalleryUrls = (data.galleryImages as any[])?.filter(img => typeof img === 'string') || [];
            const newGalleryFiles = (data.galleryImages as any[])?.filter(img => img instanceof File) || [];
            
            if (newGalleryFiles.length > 0) {
                const uploadedUrls: string[] = [];
                for (let i = 0; i < newGalleryFiles.length; i++) {
                    setUploadMessage(`Uploading gallery image ${i + 1} of ${newGalleryFiles.length}...`);
                    const url = await uploadFile(newGalleryFiles[i], tourId!);
                    uploadedUrls.push(url);
                }
                galleryImageUrls = [...existingGalleryUrls, ...uploadedUrls];
            } else {
                galleryImageUrls = existingGalleryUrls;
            }
    
            setUploadMessage('Saving tour data...');
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
            form.reset(tourData, { keepDirty: false });
    
            toast({
                title: "Tour Saved!",
                description: `The tour "${data.title.en}" has been saved successfully.`,
            });
    
        } catch (error: any) {
            console.error("Error saving tour:", error);
            toast({
                variant: "destructive",
                title: "Error saving tour",
                description: error.message || "An issue occurred, please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleTranslate = async () => {
        setIsTranslating(true);
        try {
            const currentData = form.getValues();
            
            const translationInput = {
                title: currentData.title.en,
                description: currentData.description.en,
                overview: currentData.overview.en,
                generalInfo: {
                    cancellationPolicy: currentData.generalInfo.cancellationPolicy.en,
                    bookingPolicy: currentData.generalInfo.bookingPolicy.en,
                    guideInfo: currentData.generalInfo.guideInfo.en,
                    pickupInfo: currentData.generalInfo.pickupInfo.en,
                },
                details: {
                    highlights: currentData.details?.highlights?.en || '',
                    fullDescription: currentData.details?.fullDescription?.en || '',
                    included: currentData.details?.included?.en || '',
                    notIncluded: currentData.details?.notIncluded?.en || '',
                    notSuitableFor: currentData.details?.notSuitableFor?.en || '',
                    whatToBring: currentData.details?.whatToBring?.en || '',
                    beforeYouGo: currentData.details?.beforeYouGo?.en || '',
                },
                pickupPoint: {
                    title: currentData.pickupPoint.title.en,
                    description: currentData.pickupPoint.description.en,
                },
                itinerary: currentData.itinerary?.map(item => ({
                    title: item.title.en,
                    activities: item.activities.en || [],
                })) || []
            };

            const result = await translateTourAction(translationInput);

            if (result.error) throw new Error(result.error);
            if (!result.data) throw new Error("No translation data returned.");

            const translatedData = result.data as TranslateTourOutput;
            
            // Deep merge, but overwrite entire arrays instead of merging them
            const customizer = (objValue: any, srcValue: any) => {
                if (Array.isArray(objValue)) {
                    return srcValue;
                }
            };
            const updatedData = mergeWith(cloneDeep(currentData), translatedData, customizer);

            form.reset(updatedData);

            toast({
                title: "Content Translated!",
                description: "The tour content has been translated automatically.",
            });

        } catch(error: any) {
            console.error("Translation failed:", error);
            toast({
                variant: "destructive",
                title: "Translation Error",
                description: error.message || "An unexpected issue occurred during translation.",
            });
        } finally {
            setIsTranslating(false);
        }
    }
    
    const basePath = `/${lang}/dashboard/admin/tours`;

    return (
        <div className="flex flex-col h-full">
            {isSubmitting && <UploadProgressDialog progress={uploadProgress} message={uploadMessage} />}
            <FormProvider {...form}>
                <TourFormHeader
                    isSubmitting={isSubmitting}
                    isTranslating={isTranslating}
                    onTranslate={handleTranslate}
                    initialData={initialData}
                    basePath={basePath}
                    onSubmit={form.handleSubmit(onSubmit, handleInvalidSubmit)}
                />
                <main className="flex-grow overflow-y-scroll px-4 md:px-8 lg:px-10">
                   <TourForm
                     initialData={initialData}
                    />
                </main>
            </FormProvider>
        </div>
    );
}
