'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Ticket } from 'lucide-react';
import { verifyBookingAction } from '@/app/server-actions/bookings/verifyBooking';

const formSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required.'),
  email: z.string().email('Please enter a valid email address.'),
});

export default function ManageBookingPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const pathname = usePathname();
    const lang = pathname.split('/')[1] || 'en';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            bookingId: '',
            email: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const result = await verifyBookingAction(values);
            if (result.error) {
                throw new Error(result.error);
            }

            if (result.data?.bookingId) {
                router.push(`/${lang}/booking/${result.data.bookingId}`);
            } else {
                 throw new Error('Could not verify booking. Please check your details and try again.');
            }

        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Verification Failed',
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="bg-background text-foreground min-h-screen flex items-center justify-center py-12">
            <Card className="w-full max-w-md mx-4 shadow-xl">
                <CardHeader className="text-center">
                    <Ticket className="mx-auto h-12 w-12 text-primary mb-2" />
                    <CardTitle className="text-3xl font-bold">Manage Your Booking</CardTitle>
                    <CardDescription>Enter your booking ID and email to view or cancel your reservation.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="bookingId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Booking ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your booking ID" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="The email you used to book" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" size="lg" className="w-full font-semibold" disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin" /> : 'Find My Booking'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
