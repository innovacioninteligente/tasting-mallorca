
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
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
          <CardTitle className="text-3xl font-extrabold text-primary">Crea tu Cuenta</CardTitle>
          <CardDescription className="text-lg pt-1">Únete para gestionar tus aventuras en Mallorca.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">Nombre</Label>
              <Input id="name" placeholder="Tu nombre completo" required className="h-12 text-base" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">Email</Label>
              <Input id="email" type="email" placeholder="tu@email.com" required className="h-12 text-base" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">Contraseña</Label>
              <Input id="password" type="password" placeholder="Mínimo 6 caracteres" required className="h-12 text-base" />
            </div>
            <Button type="submit" size="lg" className="w-full font-bold text-lg py-7">
              Crear Cuenta
            </Button>
          </form>
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
