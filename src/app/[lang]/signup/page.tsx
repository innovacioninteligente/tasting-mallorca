
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
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
import Image from 'next/image';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function SignUpPage() {
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
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // 2. Call server action to create Firestore doc and set custom claims
      const result = await createUserAction({
        uid: user.uid,
        email: values.email,
        name: values.name,
      });

      if (result.error) {
        throw new Error(result.error);
      }
      
      toast({
        title: 'Account created!',
        description: "You've been successfully signed up.",
      });
      
      // Force a token refresh to get custom claims on the client
      await user.getIdToken(true);

      router.push(`/${lang}/dashboard`);

    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not create account.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-background text-foreground min-h-screen flex items-center justify-center py-12">
      <Card className="w-full max-w-md mx-4 shadow-2xl border-primary/20">
        <CardHeader className="text-center">
           <div className="flex justify-center items-center gap-2 mb-2">
            <div className="relative h-12 w-32">
                <Image
                    src="https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fimages%2Flogo-2.png?alt=media&token=2dec9bc9-44e1-409e-bbb1-58805697f1a3"
                    alt="Tasting Mallorca Logo"
                    fill
                    className="object-contain"
                    sizes="128px"
                />
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold text-primary">Crea tu Cuenta</CardTitle>
          <CardDescription className="text-lg pt-1">Únete para gestionar tus aventuras en Mallorca.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu nombre completo" {...field} className="h-12 text-base" />
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
                    <FormLabel className="text-base">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="tu@email.com" {...field} className="h-12 text-base" />
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
                    <FormLabel className="text-base">Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Mínimo 6 caracteres" {...field} className="h-12 text-base" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="w-full font-bold text-lg py-7" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Crear Cuenta'}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-base">
            <p className="text-muted-foreground">
              ¿Ya tienes una cuenta?{' '}
              <Link href="signin" className="font-semibold text-primary hover:underline">
                Inicia Sesión
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
