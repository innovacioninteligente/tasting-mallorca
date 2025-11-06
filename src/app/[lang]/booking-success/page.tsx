'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home } from 'lucide-react';
import Link from 'next/link';

function BookingSuccessContent() {
  const searchParams = useSearchParams();

  const tourTitle = searchParams.get('tourTitle');
  const date = searchParams.get('date');
  const participants = searchParams.get('participants');
  const totalPrice = searchParams.get('totalPrice');
  const pickupPoint = searchParams.get('pickupPoint');
  const name = searchParams.get('name');

  return (
    <div className="bg-background text-foreground min-h-[60vh] flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 w-full md:w-[70vw] lg:w-[50vw]">
        <Card className="shadow-2xl border-primary/20">
          <CardHeader className="text-center bg-secondary/30 rounded-t-lg pt-8">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="text-3xl md:text-4xl font-extrabold text-primary">¡Reserva Confirmada!</CardTitle>
            <p className="text-muted-foreground text-lg mt-2">Gracias por confiar en Tasting Mallorca.</p>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6 text-base">
            <p className="text-center text-muted-foreground">
              Hemos enviado un email de confirmación con todos los detalles de tu reserva. Por favor, revisa tu bandeja de entrada.
            </p>
            <div className="border border-border bg-secondary/30 rounded-lg p-4 space-y-3">
              <h3 className="font-bold text-xl mb-2 text-foreground">Resumen de tu Aventura</h3>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tour:</span>
                <span className="font-semibold text-right">{tourTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fecha:</span>
                <span className="font-semibold">{date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Participantes:</span>
                <span className="font-semibold">{participants}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cliente:</span>
                <span className="font-semibold">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Punto de Recogida:</span>
                <span className="font-semibold text-right">{pickupPoint}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t mt-3">
                <span className="text-foreground">Total Pagado:</span>
                <span className="text-primary">€{totalPrice}</span>
              </div>
            </div>
            <Button asChild size="lg" className="w-full font-bold text-lg mt-6">
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Volver al Inicio
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Cargando confirmación...</div>}>
            <BookingSuccessContent />
        </Suspense>
    )
}
