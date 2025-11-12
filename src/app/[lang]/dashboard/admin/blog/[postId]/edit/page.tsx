
'use client';

import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { findBlogPostById } from "@/app/server-actions/blog/findBlogPosts";
import { notFound, useRouter } from "next/navigation";
import { BlogPost } from "@/backend/blog/domain/blog.model";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { initializeFirebase } from "@/firebase";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import { UploadProgressDialog } from "@/components/upload-progress-dialog";
import { cloneDeep, mergeWith } from "lodash";
import { parseISO } from "date-fns";
import { BlogFormHeader } from "../blog-form-header";
import { BlogForm } from "../blog-form";
import { updateBlogPost } from "@/app/server-actions/blog/updateBlogPost";
import { translateBlogPostAction, TranslateBlogPostInput } from "@/app/server-actions/blog/translateBlogPostAction";

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

const defaultMultilingual = { en: '', de: '', fr: '', nl: '' };

interface EditBlogPostPageProps {
    params: {
        postId: string;
        lang: string;
    }
}

export default function EditBlogPostPage({ params }: EditBlogPostPageProps) {
    const [initialData, setInitialData] = useState<BlogPost | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadMessage, setUploadMessage] = useState('Starting...');

    const formPersistenceKey = `blog-form-edit-${params.postId}`;
    
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

    const form = useForm<BlogFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });
    
    const { clearPersistedData } = useFormPersistence(formPersistenceKey, form, defaultValues);

    useEffect(() => {
        const fetchPost = async () => {
            setIsLoadingData(true);
            const result = await findBlogPostById(params.postId);
            if (result.error || !result.data) {
                console.error(result.error);
                notFound();
            } else {
                const post = result.data as BlogPost;
                const parsedInitialData = {
                    ...post,
                    publishedAt: post.publishedAt ? parseISO(post.publishedAt as unknown as string) : new Date(),
                };
                const mergedData = mergeWith(cloneDeep(defaultValues), parsedInitialData, (objValue, srcValue) => {
                    if (srcValue !== undefined && srcValue !== null) return srcValue;
                    return objValue;
                });
                form.reset(mergedData);
                setInitialData(post);
            }
            setIsLoadingData(false);
        };
        fetchPost();
    }, [params.postId, form]);


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
        if (!initialData) return;
        setIsSubmitting(true);
        try {
            const postId = initialData.id;

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
            
            const result = await updateBlogPost(postData as any);
    
            if (result.error) throw new Error(result.error);

            clearPersistedData();
            
            toast({
                title: "Post Updated!",
                description: `The post "${data.title.en}" has been saved successfully.`,
            });
    
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
            
            const translationInput: TranslateBlogPostInput = {
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
    
    const basePath = `/${params.lang}/dashboard/admin/blog`;
    
    if (isLoadingData || !initialData) {
        return <div>Loading...</div>; // Or a skeleton loader
    }
    
    return (
        <AdminRouteGuard>
             <div className="flex flex-col h-full">
                <FormProvider {...form}>
                    {isSubmitting && <UploadProgressDialog progress={uploadProgress} message={uploadMessage} />}
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
        </AdminRouteGuard>
    );
}

