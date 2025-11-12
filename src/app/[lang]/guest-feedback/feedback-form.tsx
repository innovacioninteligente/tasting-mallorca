
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, Send, PartyPopper, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { DictionaryType } from '@/dictionaries/get-dictionary';
import { submitGuestFeedback } from '@/app/server-actions/feedback/submitFeedback';
import { ImageUpload } from '@/app/[lang]/dashboard/admin/tours/new/image-upload';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { initializeFirebase } from "@/firebase";
import { UploadProgressDialog } from '@/components/upload-progress-dialog';

type Dictionary = DictionaryType['guestFeedback']['form'];

const GOOGLE_REVIEW_URL = 'https://g.page/r/CVTxIHcjWqA8EAE/review';

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    nationality: z.string().optional(),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    phone: z.string().optional(),
    tourDate: z.date({ required_error: 'Tour date is required' }),
    experience: z.string().min(1, 'Please tell us about your experience'),
    photo: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function FeedbackForm({ dictionary }: { dictionary: Dictionary }) {
    const { toast } = useToast();
    const [rating, setRating] = useState<number | null>(null);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadMessage, setUploadMessage] = useState('Starting...');

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            nationality: '',
            email: '',
            phone: '',
            tourDate: new Date(),
            experience: '',
            photo: undefined,
        },
    });

    const handleRatingSelect = async (selectedRating: number) => {
        setRating(selectedRating);
        if (selectedRating === 5) {
            setIsSubmitting(true);
            setUploadMessage('Submitting feedback...');
            try {
                // Submit a minimal feedback automatically
                const result = await submitGuestFeedback({
                    name: '5-Star Guest',
                    tourDate: new Date(),
                    rating: 5,
                    experience: 'Selected 5 stars.',
                });

                if (result.error) throw new Error(result.error);
                
                // Redirect to Google and show thank you page
                window.open(GOOGLE_REVIEW_URL, '_blank');
                setIsSubmitted(true);

            } catch (error: any) {
                 toast({
                    variant: 'destructive',
                    title: dictionary.errorToastTitle,
                    description: error.message,
                });
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setStep(2);
        }
    };
    
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

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        try {
            if (!rating) return;
            
            let photoUrl;
            if (data.photo instanceof File) {
                const tempId = crypto.randomUUID();
                setUploadMessage('Uploading photo...');
                photoUrl = await uploadFile(data.photo, tempId);
            }
            
            setUploadMessage('Submitting feedback...');
            setUploadProgress(100);

            const { photo, ...formData } = data;

            const result = await submitGuestFeedback({
                ...formData,
                rating,
                photoUrl,
            });

            if (result.error) throw new Error(result.error);
            
            setIsSubmitted(true);

        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: dictionary.errorToastTitle,
                description: error.message,
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isSubmitted) {
        return (
            <div className="text-center p-8 border-2 border-dashed rounded-2xl bg-secondary/50 max-w-2xl mx-auto">
                <PartyPopper className="mx-auto h-16 w-16 text-primary mb-4" />
                <h3 className="text-2xl font-bold">{dictionary.thankYouTitle}</h3>
                <p className="mt-2 text-muted-foreground">{dictionary.thankYouDescription}</p>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto shadow-2xl border-primary/20 rounded-xl">
            {isSubmitting && <UploadProgressDialog progress={uploadProgress} message={uploadMessage} />}
            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="p-8 text-center"
                    >
                        <h2 className="text-2xl font-bold mb-4">{dictionary.ratingTitle}</h2>
                        <div className="flex justify-center gap-2 md:gap-4 my-8">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={cn(
                                        "w-10 h-10 md:w-16 md:h-16 text-muted-foreground/30 cursor-pointer transition-all duration-200 transform hover:scale-110",
                                        (hoverRating ?? rating ?? 0) >= star && "text-yellow-400"
                                    )}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(null)}
                                    onClick={() => handleRatingSelect(star)}
                                />
                            ))}
                        </div>
                        <p className="text-muted-foreground">{dictionary.ratingDescription}</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-6 md:p-8"
                    >
                         <div className="flex items-center gap-4 mb-6">
                            <Button variant="ghost" size="icon" onClick={() => setStep(1)} className="shrink-0">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h2 className="text-2xl font-bold">{dictionary.formTitle}</h2>
                                <div className="flex items-center">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className={cn("w-5 h-5", i < (rating || 0) ? 'text-yellow-400' : 'text-muted-foreground/30')}/>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField control={form.control} name="name" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">{dictionary.nameLabel}</FormLabel>
                                            <FormControl><Input className="text-base h-12" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                     <FormField control={form.control} name="nationality" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">{dictionary.nationalityLabel}</FormLabel>
                                            <FormControl><Input className="text-base h-12" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                               </div>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">Email (Optional)</FormLabel>
                                            <FormControl><Input className="text-base h-12" type="email" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                     <FormField control={form.control} name="phone" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">Phone (Optional)</FormLabel>
                                            <FormControl><Input className="text-base h-12" type="tel" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                               </div>
                               <FormField control={form.control} name="tourDate" render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-base">{dictionary.tourDateLabel}</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                <Button variant={"outline"} className={cn('w-full pl-3 text-left font-normal text-base h-12', !field.value && 'text-muted-foreground')}>
                                                    {field.value ? format(field.value, 'PPP') : <span>{dictionary.pickDatePlaceholder}</span>}
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
                                )} />
                                <FormField control={form.control} name="experience" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{dictionary.experienceLabel}</FormLabel>
                                        <FormControl><Textarea className="text-base min-h-[120px]" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                 <FormField
                                    control={form.control}
                                    name="photo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">{dictionary.photoLabel}</FormLabel>
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
                                <Button type="submit" size="lg" className="w-full font-bold text-lg py-7" disabled={isSubmitting}>
                                     {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4"/>}
                                     {dictionary.submitButton}
                                </Button>
                            </form>
                        </Form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

    