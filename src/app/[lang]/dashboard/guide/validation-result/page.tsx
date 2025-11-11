
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertTriangle, XCircle, User, Users, Calendar, Hash, ScanLine, ArrowLeft, DollarSign } from 'lucide-react';
import { findBookingById } from '@/app/server-actions/bookings/findBooking';
import { validateTicket } from '@/app/server-actions/bookings/validateTicket';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { GuideRouteGuard } from '@/components/auth/guide-route-guard';

function ValidationResult() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const bookingId = searchParams.get('bookingId');
    const { toast } = useToast();

    const [bookingDetails, setBookingDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!bookingId) {
            setError('No booking ID provided.');
            setIsLoading(false);
            return;
        }

        const fetchBooking = async () => {
            setIsLoading(true);
            const result = await findBookingById(bookingId);
            if (result.error) {
                setError(result.error);
                setBookingDetails(null);
            } else {
                setBookingDetails(result.data);
                setError(null);
            }
            setIsLoading(false);
        };

        fetchBooking();
    }, [bookingId]);

    const handleValidation = async () => {
        if (!bookingId) return;

        setIsSubmitting(true);
        const result = await validateTicket({ bookingId });
        setIsSubmitting(false);

        if (result.error) {
            toast({
                variant: 'destructive',
                title: 'Validation Failed',
                description: result.error,
            });
            setError(result.error); // Update local state to reflect error
        } else {
            toast({
                title: 'Ticket Validated!',
                description: 'The ticket has been successfully redeemed.',
            });
            // Re-fetch booking to show updated status
            const updatedResult = await findBookingById(bookingId);
            if (updatedResult.data) {
                setBookingDetails(updatedResult.data);
            }
        }
    };
    
    const StatusCard = ({ status, amountDue }: { status: 'valid' | 'redeemed' | 'expired' | 'not-found', amountDue: number }) => {
        const statusConfig = {
            valid: { icon: <CheckCircle className="h-12 w-12 text-green-500" />, title: 'Ticket Válido', color: 'green' },
            redeemed: { icon: <XCircle className="h-12 w-12 text-yellow-500" />, title: 'Ticket Ya Canjeado', color: 'yellow' },
            expired: { icon: <AlertTriangle className="h-12 w-12 text-red-500" />, title: 'Ticket Expirado', color: 'red' },
            'not-found': { icon: <AlertTriangle className="h-12 w-12 text-red-500" />, title: 'Ticket No Encontrado', color: 'red' }
        };
        const currentStatus = statusConfig[status];

        return (
             <Card className={`bg-${currentStatus.color}-50 border-${currentStatus.color}-200`}>
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4">{currentStatus.icon}</div>
                    <CardTitle className={`text-2xl font-bold text-${currentStatus.color}-800`}>{currentStatus.title}</CardTitle>
                </CardHeader>
                {status === 'valid' && amountDue > 0 && (
                    <CardContent className="text-center">
                         <Alert variant="destructive" className="bg-red-100 border-red-200 text-red-800">
                             <DollarSign className="h-4 w-4 !text-red-800" />
                            <AlertTitle className="font-bold">Pago Pendiente</AlertTitle>
                            <AlertDescription>
                                Se debe cobrar la cantidad de <span className="font-bold">€{amountDue.toFixed(2)}</span> al cliente.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                )}
            </Card>
        )
    };


    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Buscando reserva...</p>
            </div>
        );
    }
    
     const ticketStatus = error ? 'not-found' : bookingDetails?.ticketStatus;
     const amountDue = bookingDetails?.amountDue || 0;

    return (
        <div className="max-w-xl mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold text-center mb-6">Resultado de Validación</h1>

            { (bookingDetails || error) && <StatusCard status={ticketStatus} amountDue={amountDue} />}

            {bookingDetails && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="text-xl">Detalles de la Reserva</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-base">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-2"><Hash className="h-4 w-4"/>ID Reserva</span>
                            <span className="font-mono text-sm">{bookingDetails.id.substring(0, 8)}...</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-2"><User className="h-4 w-4"/>Tour</span>
                            <span className="font-medium text-right">{bookingDetails.tour?.title?.en}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4"/>Fecha</span>
                            <span className="font-medium">{format(new Date(bookingDetails.date.seconds * 1000), "PPP")}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-2"><Users className="h-4 w-4"/>Participantes</span>
                            <span className="font-medium">{bookingDetails.participants}</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="mt-8 space-y-3">
                 {bookingDetails && ticketStatus === 'valid' && (
                    <Button 
                        size="lg" 
                        className="w-full font-bold text-lg py-7" 
                        onClick={handleValidation}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : <> <CheckCircle className="mr-2 h-5 w-5"/>Confirmar Check-in</> }
                    </Button>
                )}
                <Button variant="outline" size="lg" className="w-full" onClick={() => router.back()}>
                    <ScanLine className="mr-2 h-5 w-5"/>
                    Escanear Otro Ticket
                </Button>
            </div>
        </div>
    );
}


export default function ValidationResultPage() {
    return (
        <GuideRouteGuard>
            <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
                <ValidationResult />
            </Suspense>
        </GuideRouteGuard>
    )
}
