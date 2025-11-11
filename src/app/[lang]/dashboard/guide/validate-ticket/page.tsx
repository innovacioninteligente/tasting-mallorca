'use client';

import { useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Result } from '@zxing/library';
import { useZxing } from 'react-zxing';
import { GuideRouteGuard } from '@/components/auth/guide-route-guard';

export default function ValidateTicketPage() {
    const router = useRouter();
    const pathname = usePathname();
    const lang = pathname.split('/')[1] || 'en';
    const [error, setError] = useState<string | null>(null);

    const handleScanResult = (result: Result) => {
        const bookingId = result.getText();
        if (bookingId) {
            const validationResultUrl = `/${lang}/dashboard/guide/validation-result?bookingId=${bookingId}`;
            router.push(validationResultUrl);
        }
    };
    
    const { ref } = useZxing({
        onDecodeResult: handleScanResult,
        onError: (e) => {
            if (e?.name === 'NotAllowedError') {
                setError('Camera access denied. Please enable camera permissions in your browser settings.');
            } else if (e) {
                console.error(e);
                setError('Failed to start camera. Please ensure another app is not using it or try refreshing the page.');
            }
        },
    });

    return (
        <GuideRouteGuard>
            <div className="container mx-auto p-4 md:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">Validar Ticket</h1>
                    <p className="text-muted-foreground">Apunta la cámara al código QR del ticket del cliente.</p>
                </div>

                <Card className="max-w-2xl mx-auto overflow-hidden">
                    <CardContent className="p-0 relative">
                        <video ref={ref} className="w-full h-auto" />
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/2 pointer-events-none">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
                        </div>
                    </CardContent>
                </Card>
                
                {error && (
                    <Alert variant="destructive" className="mt-6 max-w-2xl mx-auto">
                         <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="mt-6 text-center text-sm text-muted-foreground max-w-2xl mx-auto">
                    <p>
                        Asegúrate de que la aplicación tiene permisos para acceder a la cámara.
                        Si el escáner no funciona, puedes introducir el código del ticket manualmente.
                    </p>
                </div>
            </div>
        </GuideRouteGuard>
    );
}
