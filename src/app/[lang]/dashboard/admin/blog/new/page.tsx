
'use client';

import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { useForm, FormProvider, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { usePathname, useRouter } from "next/navigation";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { initializeFirebase } from "@/firebase";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import { UploadProgressDialog } from "@/components/upload-progress-dialog";
import { cloneDeep, mergeWith } from "lodash";
import { BlogFormHeader } from "../blog-form-header";
import { BlogForm, getFieldTab } from "../blog-form";
import { createBlogPost } from "@/app/server-actions/blog/createBlogPost";
import { translateBlogPostAction, TranslateBlogPostInput } from "@/app/server-actions/blog/translateBlogPostAction";
import { CreateBlogPostInput, CreateBlogPostInputSchema } from "@/backend/blog/domain/blog.model";

type BlogFormValues = CreateBlogPostInput;

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

export default function NewBlogPostPage() {
    const pathname = usePathname();
    const router = useRouter();
    const { toast } = useToast();
    const lang = pathname.split('/')[1] || 'en';

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadMessage, setUploadMessage] = useState('Starting...');
    const [activeTab, setActiveTab] = useState('main');
    const [errorTab, setErrorTab] = useState<string | null>(null);

    const formPersistenceKey = 'blog-form-new';
    
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
        resolver: zodResolver(CreateBlogPostInputSchema),
        defaultValues: defaultValues,
    });

    const { clearPersistedData } = useFormPersistence(formPersistenceKey, form, defaultValues);

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

    const handleInvalidSubmit = (errors: FieldErrors<BlogFormValues>) => {
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

    const onSubmit = async (data: BlogFormValues) => {
        setIsSubmitting(true);
        try {
            const postId = crypto.randomUUID();

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
                publishedAt: data.publishedAt,
            };
            
            const result = await createBlogPost(postData as any);
    
            if (result.error) throw new Error(result.error);

            clearPersistedData();
            
            toast({
                title: "Post Created!",
                description: `The post "${data.title.en}" has been created successfully.`,
            });
            
            router.replace(`/${lang}/dashboard/admin/blog/${postId}/edit`, { scroll: false });
    
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
    
    const basePath = `/${lang}/dashboard/admin/blog`;

    return (
        <AdminRouteGuard>
            <div className="flex flex-col h-full">
                {isSubmitting && <UploadProgressDialog progress={uploadProgress} message={uploadMessage} />}
                <FormProvider {...form}>
                    <BlogFormHeader
                        isSubmitting={isSubmitting}
                        isTranslating={isTranslating}
                        onTranslate={handleTranslate}
                        isEditing={false}
                        basePath={basePath}
                        onSubmit={form.handleSubmit(onSubmit, handleInvalidSubmit)}
                    />
                    <main className="flex-grow overflow-y-scroll px-4 pt-4 md:px-8 lg:px-10">
                       <BlogForm
                         activeTab={activeTab}
                         onTabChange={setActiveTab}
                         errorTab={errorTab}
                       />
                    </main>
                </FormProvider>
            </div>
        </AdminRouteGuard>
    );
}

    