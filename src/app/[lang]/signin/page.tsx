
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export default function SignInPage({ params }: { params: { lang: string }}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!auth) return;
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: 'Signed in successfully!',
        description: "You're now logged in.",
      });
      router.push(`/${params.lang}/dashboard`);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not sign in.',
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
            <Sprout className="h-8 w-8 text-primary" />
            <span className="font-headline text-2xl font-bold">
              Tasting Mallorca
            </span>
          </div>
          <CardTitle className="text-3xl font-extrabold text-primary">¡Bienvenido de Nuevo!</CardTitle>
          <CardDescription className="text-lg pt-1">Accede a tu cuenta para ver tus reservas.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-base">Contraseña</FormLabel>
                      <Link href="#" className="text-sm text-primary hover:underline">
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" {...field} className="h-12 text-base" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="w-full font-bold text-lg py-7" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Iniciar Sesión'}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-base">
            <p className="text-muted-foreground">
              ¿No tienes una cuenta?{' '}
              <Link href="signup" className="font-semibold text-primary hover:underline">
                Regístrate
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
