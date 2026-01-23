'use client';

import { useEffect, useRef } from 'react';
import { sendMetaEvent } from '@/app/server-actions/analytics/sendMetaEvent';

interface BookingSuccessTrackerProps {
    transactionId: string;
    value: number;
    currency: string;
    items: any[];
    user_data?: {
        email_hashed?: string;
        phone_hashed?: string;
        email_plain?: string;
        phone_plain?: string;
    };
    lang: string;
}

export function BookingSuccessTracker({
    transactionId,
    value,
    currency,
    items,
    user_data,
    lang
}: BookingSuccessTrackerProps) {
    const firedRef = useRef(false);

    useEffect(() => {
        if (firedRef.current) return;

        // 1. GTM Purchase Event (El único disparador Client-Side necesario)
        if (typeof window !== 'undefined' && window.dataLayer) {
            window.dataLayer.push({
                event: 'purchase',
                ecommerce: {
                    transaction_id: transactionId,
                    value: value,
                    currency: currency,
                    items: items,
                    user_data: {
                        // Enviamos los datos hasheados para GTM (Enhanced Conversions)
                        email_hashed: user_data?.email_hashed,
                        phone_hashed: user_data?.phone_hashed
                    }
                }
            });

            // 2. Meta CAPI (Server-side)
            // MANTENEMOS ESTO: Es robusto y funciona en paralelo al navegador.
            // La clave "transactionId" servirá para que Facebook elimine duplicados
            // si configuramos el Pixel en GTM con el mismo ID.
            sendMetaEvent(
                'Purchase',
                transactionId, // Deduplication key
                {
                    email: user_data?.email_plain,
                    phone: user_data?.phone_plain,
                },
                {
                    value: value,
                    currency: currency,
                    content_ids: items.map(i => i.item_id),
                    content_type: 'product'
                }
            );

            console.log('Events pushed to DataLayer & CAPI sent:', { transactionId, value });
            firedRef.current = true;
        }
    }, [transactionId, value, currency, items, user_data, lang]);

    return null;
}