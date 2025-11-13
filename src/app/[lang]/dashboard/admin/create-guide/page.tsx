
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter, usePathname } from 'next/navigation';
import { createUserAction } from '@/app/server-actions/users/createUserAction';
import { AdminRouteGuard } from '@/components/auth/admin-route-guard';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function CreateGuidePage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!auth) return;

    const lang = pathname.split('/')[1];

    setIsLoading(true);
    try {
      // NOTE: This creates the user on the client, which is not ideal for an admin panel.
      // A more robust solution would use a server-side method to create the user directly.
      // However, for this implementation, we'll proceed this way.
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // Call server action to create Firestore doc and set custom claims for 'guide'
      const result = await createUserAction({
        uid: user.uid,
        email: values.email,
        name: values.name,
        role: 'guide', // Explicitly set the role
      });

      if (result.error) {
        // If the server action fails, we should ideally delete the auth user to prevent orphans.
        // This requires admin privileges on the backend, which is a more complex setup.
        // For now, we'll just show an error.
        throw new Error(`Server action failed: ${result.error}`);
      }
      
      toast({
        title: 'Guide Account Created!',
        description: `The account for ${values.name} has been successfully created with the guide role.`,
      });
      
      // Navigate back to the users list
      router.push(`/${lang}/dashboard/users`);

    } catch (error: any) {
      console.error('Error creating guide:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not create guide account.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AdminRouteGuard>
        <div className="flex items-center justify-center py-12">
            <Card className="w-full max-w-md mx-4">
                <CardHeader className="text-center">
                    <UserPlus className="mx-auto h-12 w-12 text-primary mb-2" />
                    <CardTitle className="text-3xl font-bold">Create a New Guide</CardTitle>
                    <CardDescription className="text-lg pt-1">This will create a new user account with the 'guide' role.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 md:p-8 space-y-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                <Input placeholder="Guide's full name" {...field} />
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
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                <Input placeholder="guide@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Temporary Password</FormLabel>
                                <FormControl>
                                <Input type="password" placeholder="At least 6 characters" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" size="lg" className="w-full font-bold" disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Create Guide Account'}
                        </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    </AdminRouteGuard>
  );
}
