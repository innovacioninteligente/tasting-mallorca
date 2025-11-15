

'use client';

import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { TourForm, getFieldTab } from "./tour-form";
import { useForm, FormProvider, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TourFormHeader } from "./tour-form-header";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { initializeFirebase } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { createTour } from "@/app/server-actions/tours/createTour";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import { UploadProgressDialog } from "@/components/upload-progress-dialog";
import { cloneDeep, mergeWith } from "lodash";
import { translateTourAction } from "@/app/server-actions/tours/translateTourAction";
import { TranslateTourInput, TranslateTourOutput } from "@/ai/flows/translate-tour-flow";
import { CreateTourInput, CreateTourInputSchema } from "@/backend/tours/domain/tour.model";

type TourFormValues = CreateTourInput;

const defaultMultilingual = { en: '', de: '', fr: '', nl: '' };

function getFirstErrorMessage(errors: FieldErrors): { message: string, path: string } | null {
    for (const key in errors) {
        if (Object.prototype.hasOwnProperty.call(errors, key)) {
            const error = errors[key as keyof FieldErrors] as any;
            if (error?.message) {
                return { message: error.message, path: key };
            }
            if (typeof error === 'object' && !Array.isArray(error)) {
                const nested = getFirstErrorMessage(error);
                if (nested) {
                    return { message: nested.message, path: `${key}.${nested.path}` };
                }
            }
        }
    }
    return null;
}


export default function NewTourPage() {
    const pathname = usePathname();
    const router = useRouter();
    const { toast } = useToast();
    const lang = pathname.split('/')[1];

    const formPersistenceKey = 'tour-form-new';

    const defaultValues: TourFormValues = {
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
        childPrice: 0,
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

    const form = useForm<TourFormValues>({
        resolver: zodResolver(CreateTourInputSchema),
        defaultValues,
    });
    
    const { clearPersistedData } = useFormPersistence(formPersistenceKey, form, defaultValues);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadMessage, setUploadMessage] = useState('Starting...');
    const [activeTab, setActiveTab] = useState('main');
    const [errorTab, setErrorTab] = useState<string | null>(null);

    const basePath = `/${lang}/dashboard/admin/tours`;

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

    const handleInvalidSubmit = (errors: FieldErrors<TourFormValues>) => {
        const errorDetails = getFirstErrorMessage(errors);
        if (errorDetails) {
            toast({
                variant: "destructive",
                title: "Validation Error",
                description: `Field '${errorDetails.path}' is invalid: ${errorDetails.message}`,
            });
            const tabWithError = getFieldTab(errorDetails.path);
            if (tabWithError) {
                setActiveTab(tabWithError);
                setErrorTab(tabWithError);
                setTimeout(() => setErrorTab(null), 500); 
            }
        }
    };

    const onSubmit = async (data: TourFormValues) => {
        setIsSubmitting(true);
    
        try {
            const tourId = data.id || crypto.randomUUID();
    
            let mainImageUrl = data.mainImage;
            if (data.mainImage instanceof File) {
                setUploadMessage('Uploading main image...');
                mainImageUrl = await uploadFile(data.mainImage, tourId);
            }
    
            let galleryImageUrls: string[] = [];
            const newGalleryFiles = (data.galleryImages as any[])?.filter(img => img instanceof File) || [];
            
            if (newGalleryFiles.length > 0) {
                const uploadedUrls: string[] = [];
                for (let i = 0; i < newGalleryFiles.length; i++) {
                    setUploadMessage(`Uploading gallery image ${i + 1} of ${newGalleryFiles.length}...`);
                    const url = await uploadFile(newGalleryFiles[i], tourId);
                    uploadedUrls.push(url);
                }
                galleryImageUrls = uploadedUrls;
            }
    
            setUploadMessage('Saving tour data...');
            setUploadProgress(100);
    
            const tourData = {
                ...data,
                id: tourId,
                mainImage: mainImageUrl,
                galleryImages: galleryImageUrls,
                availabilityPeriods: data.availabilityPeriods?.map(p => ({
                    ...p,
                    startDate: p.startDate.toISOString().split('T')[0],
                    endDate: p.endDate.toISOString().split('T')[0]
                }))
            };
            
            const result = await createTour(tourData);
    
            if (result.error) throw new Error(result.error);
            
            clearPersistedData();
            
            const newPath = `${basePath}/${tourId}/edit`;
            router.replace(newPath, { scroll: false });
    
            toast({
                title: "Tour Created!",
                description: `The tour "${data.title.en}" has been created successfully.`,
            });
    
        } catch (error: any) {
            console.error("Error creating tour:", error);
            toast({
                variant: "destructive",
                title: "Error creating tour",
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
            
            const translationInput: TranslateTourInput = {
                title: currentData.title.en,
                slug: currentData.slug.en,
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
                    title: { en: item.title.en },
                    activities: { en: item.activities.en || [] },
                })) || []
            };

            const result = await translateTourAction(translationInput);

            if (result.error) throw new Error(result.error);
            if (!result.data) throw new Error("No translation data returned.");
            
            const translatedData = result.data as TranslateTourOutput;
            
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
            const errorMessage = error.message || "An unexpected issue occurred during translation.";

            toast({
                variant: "destructive",
                title: "Translation Error",
                description: errorMessage,
            });
        } finally {
            setIsTranslating(false);
        }
    }


    return (
        <AdminRouteGuard>
             <FormProvider {...form}>
                <div className="flex flex-col h-full">
                    {isSubmitting && <UploadProgressDialog progress={uploadProgress} message={uploadMessage} />}
                    <TourFormHeader
                        isSubmitting={isSubmitting}
                        isTranslating={isTranslating}
                        onTranslate={handleTranslate}
                        basePath={basePath}
                    />
                    <main className="flex-grow overflow-y-scroll px-4 pt-4 md:px-8 lg:px-10">
                        <form
                            id="tour-form"
                            onSubmit={form.handleSubmit(onSubmit, handleInvalidSubmit)}
                            className="space-y-8"
                        >
                            <TourForm
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                                errorTab={errorTab}
                            />
                        </form>
                    </main>
                </div>
            </FormProvider>
        </AdminRouteGuard>
    );
}
