
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Star, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { GuestFeedback, GuestFeedbackSchema, GuestFeedbackFormValues } from "@/backend/feedback/domain/feedback.model";
import { createGuestFeedback } from "@/app/server-actions/feedback/createGuestFeedback";
import { updateGuestFeedback } from "@/app/server-actions/feedback/updateGuestFeedback";
import { ImageUpload } from "@/app/[lang]/dashboard/admin/tours/new/image-upload";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { initializeFirebase } from "@/firebase";
import { UploadProgressDialog } from "@/components/upload-progress-dialog";

interface FeedbackFormProps {
    setSheetOpen: (open: boolean) => void;
    initialData?: GuestFeedback | null;
}

export function FeedbackForm({ setSheetOpen, initialData }: FeedbackFormProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadMessage, setUploadMessage] = useState('Starting...');
    const [rating, setRating] = useState(initialData?.rating || 0);

    const form = useForm<GuestFeedbackFormValues>({
        resolver: zodResolver(GuestFeedbackSchema),
        defaultValues: {
            name: '',
            nationality: '',
            email: '',
            phone: '',
            experience: '',
            photoUrl: '',
            published: false,
            isFeatured: false,
            rating: 0,
        }
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                ...initialData,
                tourDate: parseISO(initialData.tourDate),
            });
            setRating(initialData.rating);
        } else {
            form.reset({
                name: '',
                nationality: '',
                email: '',
                phone: '',
                experience: '',
                photoUrl: '',
                published: false,
                isFeatured: false,
                rating: 0,
                tourDate: new Date(),
            });
            setRating(0);
        }
    }, [initialData, form]);
    
    useEffect(() => {
        form.setValue('rating', rating);
    }, [rating, form]);

    const uploadFile = (file: File, feedbackId: string): Promise<string> => {
      return new Promise((resolve, reject) => {
          const { app } = initializeFirebase();
          const storage = getStorage(app);
          const fileName = `feedback/${feedbackId}/${Date.now()}-${file.name}`;
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

    const onSubmit = async (data: GuestFeedbackFormValues) => {
        setIsSubmitting(true);
        try {
            let photoUrl = data.photoUrl;
            let result;

            if (initialData && initialData.id) { // UPDATE
                if (data.photoUrl instanceof File) {
                    setUploadMessage('Uploading photo...');
                    photoUrl = await uploadFile(data.photoUrl, initialData.id);
                }
                
                setUploadMessage('Updating feedback...');
                result = await updateGuestFeedback({ ...data, id: initialData.id, photoUrl });
                if (result.error) throw new Error(result.error);
                
                toast({ title: "Feedback Updated", description: "The feedback has been updated successfully." });

            } else { // CREATE
                const feedbackId = crypto.randomUUID();
                if (data.photoUrl instanceof File) {
                    setUploadMessage('Uploading photo...');
                    photoUrl = await uploadFile(data.photoUrl, feedbackId);
                }

                setUploadMessage('Creating feedback...');
                result = await createGuestFeedback({ ...data, photoUrl, id: feedbackId });
                if (result.error) throw new Error(result.error);

                toast({ title: "Feedback Created", description: "The new feedback has been added successfully." });
            }
           
            router.refresh();
            setSheetOpen(false);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: initialData ? 'Error updating feedback' : 'Error creating feedback',
                description: error.message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {isSubmitting && <UploadProgressDialog progress={uploadProgress} message={uploadMessage} />}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
                    
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Author Name</FormLabel>
                            <FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl><Input placeholder="e.g., john@example.com" {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl><Input placeholder="e.g., +123456789" {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                    
                    <FormField control={form.control} name="nationality" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nationality</FormLabel>
                            <FormControl><Input placeholder="e.g., British" {...field} value={field.value || ''} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    
                    <FormField control={form.control} name="tourDate" render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Tour Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}/>
                    
                    <FormItem>
                        <FormLabel>Rating</FormLabel>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={cn(
                                        "w-6 h-6 text-muted-foreground/30 cursor-pointer transition-colors",
                                        rating >= star && "text-yellow-400 fill-yellow-400"
                                    )}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>
                        <FormMessage>{form.formState.errors.rating?.message}</FormMessage>
                    </FormItem>


                    <FormField control={form.control} name="experience" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Feedback Text</FormLabel>
                            <FormControl><Textarea rows={6} placeholder="Describe the customer's experience..." {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    
                    <FormField control={form.control} name="photoUrl" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Photo</FormLabel>
                            <FormDescription>Upload a photo for this feedback.</FormDescription>
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
                    )}/>

                    <div className="space-y-4">
                        <FormField control={form.control} name="published" render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5"><FormLabel>Published</FormLabel></div>
                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="isFeatured" render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5"><FormLabel>Featured</FormLabel></div>
                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                        )}/>
                    </div>


                    <div className="pt-4 flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {initialData ? 'Save Changes' : 'Create Feedback'}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    )
}
