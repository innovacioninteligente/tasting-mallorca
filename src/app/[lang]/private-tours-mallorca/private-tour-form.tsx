
'use client';

import { useForm, Controller } from 'react-hook-form';
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
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { submitPrivateTourRequest } from '@/app/server-actions/private-tours/submitPrivateTourRequest';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const visitPreferences = [
    { id: 'local-markets', label: 'Local markets' },
    { id: 'hidden-villages', label: 'Hidden villages' },
    { id: 'olive-oil-estates', label: 'Olive oil estates' },
    { id: 'wineries', label: 'Wineries or wine tastings' },
    { id: 'mallorcan-food', label: 'Traditional Mallorcan food experiences' },
    { id: 'country-houses', label: 'Authentic country houses' },
    { id: 'artisan-markets', label: 'Artisan or craft markets' },
    { id: 'scenic-routes', label: 'Scenic routes & viewpoints' },
];

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

export function PrivateTourForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      nationality: '',
      hotel: '',
      participants: 1,
      preferredLanguage: 'en',
      visitPreferences: [],
      additionalComments: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await submitPrivateTourRequest(data);
      if (result.error) {
        throw new Error(result.error);
      }
      toast({
        title: 'Request Sent!',
        description: "We'll get back to you within 24 hours with a tailor-made proposal.",
      });
      form.reset();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error submitting request',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input type="email" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number (Optional)</FormLabel>
                <FormControl><Input type="tel" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField control={form.control} name="nationality" render={({ field }) => (
              <FormItem>
                <FormLabel>Nationality (Optional)</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField control={form.control} name="hotel" render={({ field }) => (
            <FormItem>
              <FormLabel>Hotel or accommodation name</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="preferredDate" render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Preferred tour date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
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
                <FormLabel>Number of participants</FormLabel>
                <FormControl><Input type="number" min="1" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField control={form.control} name="preferredLanguage" render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred language for the tour</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select a language" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="nl">Dutch</SelectItem>
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
                <FormLabel className="text-base">What would you like to visit?</FormLabel>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {visitPreferences.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="visitPreferences"
                    render={({ field }) => (
                      <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), item.id])
                                : field.onChange(field.value?.filter((value) => value !== item.id));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{item.label}</FormLabel>
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
              <FormLabel>Additional comments or preferences</FormLabel>
              <FormControl><Textarea rows={4} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" size="lg" className="w-full font-bold" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send Request'}
        </Button>
        <p className="text-center text-sm text-muted-foreground">We’ll get back to you within 24 hours with a tailor-made proposal.</p>
      </form>
    </Form>
  );
}
