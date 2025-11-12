
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2, MailCheck } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { submitPrivateTourRequest } from '@/app/server-actions/private-tours/submitPrivateTourRequest';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DictionaryType } from '@/dictionaries/get-dictionary';

type Dictionary = DictionaryType['privateTours']['form'];

const visitPreferencesOptions = [
    'local-markets', 'hidden-villages', 'olive-oil-estates', 'wineries',
    'mallorcan-food', 'country-houses', 'artisan-markets', 'scenic-routes'
] as const;

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  nationality: z.string().optional(),
  hotel: z.string().min(1, 'Hotel or accommodation is required'),
  preferredDate: z.date().optional(),
  participants: z.coerce.number().min(1, 'At least one participant is required'),
  preferredLanguage: z.string().optional(),
  visitPreferences: z.array(z.string()).optional(),
  additionalComments: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const defaultFormValues = {
  name: '',
  email: '',
  phone: '',
  nationality: '',
  hotel: '',
  participants: 1,
  preferredLanguage: 'en',
  visitPreferences: [],
  additionalComments: '',
};

export function PrivateTourForm({ dictionary }: { dictionary: Dictionary }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await submitPrivateTourRequest(data);
      if (result.error) {
        throw new Error(result.error);
      }
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
  };

  const handleSendAnother = () => {
    form.reset(defaultFormValues);
    setIsSubmitted(false);
  }

  if (isSubmitted) {
    return (
        <div className="text-center p-8 border-2 border-dashed rounded-2xl bg-secondary/50">
            <MailCheck className="mx-auto h-16 w-16 text-primary mb-4" />
            <h3 className="text-2xl font-bold">{dictionary.successToastTitle}</h3>
            <p className="mt-2 text-muted-foreground">{dictionary.successToastDescription}</p>
            <Button onClick={handleSendAnother} className="mt-6">
                {dictionary.submitAnotherRequestButton || "Submit Another Request"}
            </Button>
        </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">{dictionary.fullNameLabel}</FormLabel>
                <FormControl><Input className="text-base" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">{dictionary.emailLabel}</FormLabel>
                <FormControl><Input className="text-base" type="email" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">{dictionary.phoneLabel}</FormLabel>
                <FormControl><Input className="text-base" type="tel" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField control={form.control} name="nationality" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">{dictionary.nationalityLabel}</FormLabel>
                <FormControl><Input className="text-base" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField control={form.control} name="hotel" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">{dictionary.hotelLabel}</FormLabel>
              <FormControl><Input className="text-base" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="preferredDate" render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-base">{dictionary.preferredDateLabel}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className={cn('w-full pl-3 text-left font-normal text-base', !field.value && 'text-muted-foreground')}>
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
            )}
          />
          <FormField control={form.control} name="participants" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">{dictionary.participantsLabel}</FormLabel>
                <FormControl><Input className="text-base" type="number" min="1" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField control={form.control} name="preferredLanguage" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">{dictionary.languageLabel}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger className="text-base"><SelectValue placeholder={dictionary.selectLanguagePlaceholder} /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="en">{dictionary.languageEn}</SelectItem>
                  <SelectItem value="de">{dictionary.languageDe}</SelectItem>
                  <SelectItem value="fr">{dictionary.languageFr}</SelectItem>
                  <SelectItem value="nl">{dictionary.languageNl}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="visitPreferences"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-lg">{dictionary.visitPreferencesLabel}</FormLabel>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {visitPreferencesOptions.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="visitPreferences"
                    render={({ field }) => (
                      <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), item])
                                : field.onChange(field.value?.filter((value) => value !== item));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal text-base">{dictionary.visitPreferences[item]}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField control={form.control} name="additionalComments" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">{dictionary.commentsLabel}</FormLabel>
              <FormControl><Textarea className="text-base" rows={4} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" size="lg" className="w-full font-bold bg-accent text-accent-foreground hover:bg-accent/90 text-lg" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : dictionary.submitButton}
        </Button>
        <p className="text-center text-base text-muted-foreground">{dictionary.submittingMessage}</p>
      </form>
    </Form>
  );
}
