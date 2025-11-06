
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
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
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">Email</Label>
              <Input id="email" type="email" placeholder="tu@email.com" required className="h-12 text-base" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-base">Contraseña</Label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input id="password" type="password" required className="h-12 text-base" />
            </div>
            <Button type="submit" size="lg" className="w-full font-bold text-lg py-7">
              Iniciar Sesión
            </Button>
          </form>
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
