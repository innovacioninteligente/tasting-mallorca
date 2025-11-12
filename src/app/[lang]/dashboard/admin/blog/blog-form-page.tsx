
'use client';

import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { initializeFirebase } from "@/firebase";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import { UploadProgressDialog } from "@/components/upload-progress-dialog";
import { cloneDeep, mergeWith } from "lodash";
import { BlogPost } from "@/backend/blog/domain/blog.model";
import { parseISO } from "date-fns";
import { BlogFormHeader } from "./blog-form-header";
import { BlogForm } from "./blog-form";
import { createBlogPost } from "@/app/server-actions/blog/createBlogPost";
import { updateBlogPost } from "@/app/server-actions/blog/updateBlogPost";
import { translateBlogPostAction } from "@/app/server-actions/blog/translateBlogPostAction";

const multilingualStringSchema = z.object({
    en: z.string().min(1, { message: "El texto en inglés es requerido." }),
    de: z.string().optional(),
    fr: z.string().optional(),
    nl: z.string().optional(),
});

const formSchema = z.object({
  id: z.string().optional(),
  title: multilingualStringSchema,
  slug: multilingualStringSchema,
  summary: multilingualStringSchema,
  content: multilingualStringSchema,
  author: z.string().min(1, "El autor es requerido."),
  isFeatured: z.boolean().default(false),
  published: z.boolean().default(false),
  mainImage: z.any().refine(val => val, "La imagen principal es requerida."),
  publishedAt: z.date({ required_error: "La fecha de publicación es requerida." }),
});

type BlogFormValues = z.infer<typeof formSchema>;

interface BlogFormPageProps {
    initialData?: BlogPost;
    lang: string;
}

const defaultMultilingual = { en: '', de: '', fr: '', nl: '' };

export function BlogFormPage({ initialData, lang }: BlogFormPageProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadMessage, setUploadMessage] = useState('Starting...');

    const formPersistenceKey = initialData ? `blog-form-edit-${initialData.id}` : 'blog-form-new';
    
    const defaultValues: BlogFormValues = {
        title: { ...defaultMultilingual },
        slug: { ...defaultMultilingual },
        summary: { ...defaultMultilingual },
        content: { ...defaultMultilingual },
        author: 'Tasting Mallorca',
        isFeatured: false,
        published: false,
        mainImage: undefined,
        publishedAt: new Date(),
    };

    const parsedInitialData = initialData ? {
        ...initialData,
        publishedAt: initialData.publishedAt ? parseISO(initialData.publishedAt as unknown as string) : new Date(),
    } : {};
    
    const mergedData = mergeWith(cloneDeep(defaultValues), parsedInitialData, (objValue, srcValue) => {
        if (srcValue !== undefined && srcValue !== null) return srcValue;
        return objValue;
    });

    const form = useForm<BlogFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: mergedData,
    });

    const { clearPersistedData } = useFormPersistence(formPersistenceKey, form, mergedData);

    const uploadFile = (file: File, postId: string): Promise<string> => {
      return new Promise((resolve, reject) => {
          const { app } = initializeFirebase();
          const storage = getStorage(app);
          const fileName = `blog/${postId}/${Date.now()}-${file.name}`;
          const fileRef = storageRef(storage, fileName);
          const uploadTask = uploadBytesResumable(fileRef, file);

          uploadTask.on(
              'state_changed',
              (snapshot) => setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
              (error) => { console.error("Upload failed:", error); reject(error); },
              () => getDownloadURL(uploadTask.snapshot.ref).then(resolve)
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

    const onSubmit = async (data: BlogFormValues) => {
        setIsSubmitting(true);
        try {
            const isEditing = !!initialData;
            const postId = initialData?.id || crypto.randomUUID();

            let mainImageUrl = data.mainImage;
            if (data.mainImage instanceof File) {
                setUploadMessage('Uploading main image...');
                mainImageUrl = await uploadFile(data.mainImage, postId);
            }
    
            setUploadMessage('Saving post data...');
            setUploadProgress(100);
    
            const postData = {
                ...data,
                id: postId,
                mainImage: mainImageUrl,
                publishedAt: data.publishedAt.toISOString(),
            };
            
            const result = isEditing 
              ? await updateBlogPost(postData as any)
              : await createBlogPost(postData as any);
    
            if (result.error) throw new Error(result.error);

            clearPersistedData();
            
            toast({
                title: isEditing ? "Post Updated!" : "Post Created!",
                description: `The post "${data.title.en}" has been saved successfully.`,
            });
            
            if (!isEditing) {
                router.replace(`/${lang}/dashboard/admin/blog/${postId}/edit`, { scroll: false });
            }
    
        } catch (error: any) {
            console.error("Error saving post:", error);
            toast({
                variant: "destructive",
                title: "Error saving post",
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
                slug: currentData.slug.en,
                summary: currentData.summary.en,
                content: currentData.content.en,
            };

            const result = await translateBlogPostAction(translationInput);

            if (result.error) throw new Error(result.error);
            if (!result.data) throw new Error("No translation data returned.");

            const translatedData = result.data;
            const updatedData = mergeWith(cloneDeep(currentData), translatedData);
            form.reset(updatedData);

            toast({
                title: "Content Translated!",
                description: "The blog post content has been translated automatically.",
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
    
    const basePath = `/${lang}/dashboard/admin/blog`;

    return (
        <div className="flex flex-col h-full">
            {isSubmitting && <UploadProgressDialog progress={uploadProgress} message={uploadMessage} />}
            <FormProvider {...form}>
                <BlogFormHeader
                    isSubmitting={isSubmitting}
                    isTranslating={isTranslating}
                    onTranslate={handleTranslate}
                    isEditing={!!initialData}
                    basePath={basePath}
                    onSubmit={form.handleSubmit(onSubmit, handleInvalidSubmit)}
                />
                <main className="flex-grow overflow-y-auto px-4 pt-4 md:px-8 lg:px-10">
                   <BlogForm />
                </main>
            </FormProvider>
        </div>
    );
}
