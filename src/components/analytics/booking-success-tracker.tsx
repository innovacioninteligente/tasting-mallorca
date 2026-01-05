'use client';

import { useEffect, useRef } from 'react';

interface BookingSuccessTrackerProps {
    transactionId: string;
    value: number;
    currency: string;
    items: any[];
    user_data?: {
        email_hashed?: string;
        phone_hashed?: string;
    };
}

export function BookingSuccessTracker({
    transactionId,
    value,
    currency,
    items,
    user_data
}: BookingSuccessTrackerProps) {
    const firedRef = useRef(false);

    useEffect(() => {
        if (firedRef.current) return;

        if (typeof window !== 'undefined' && window.dataLayer) {
            window.dataLayer.push({
                event: 'purchase',
                ecommerce: {
                    transaction_id: transactionId,
                    value: value,
                    currency: currency,
                    items: items,
                    user_data: {
                        // Google Enhanced Conversions expects 'email' and 'phone_number' keys 
                        // when passing hashed data, but sometimes 'sha256_email_address' etc.
                        // Standard GTM variable mapping usually maps "User Email" -> "email"
                        // We'll pass them with generic keys and map them in GTM variables.
                        email: user_data?.email_hashed,
                        phone: user_data?.phone_hashed
                    }
                }
            });

            // Google Ads Conversion Event
            // Using 'send_to' to route specifically to the Ads conversion label
            const gtag = (window as any).gtag || function () { (window.dataLayer || []).push(arguments); };
            gtag('event', 'conversion', {
                'send_to': 'AW-17852397239/5VzgCKH00dwbELft18BC',
                'value': value,
                'currency': currency,
                'transaction_id': transactionId
            });

            console.log('Purchase & Conversion events fired:', { transactionId, value });
            firedRef.current = true;
        }
    }, [transactionId, value, currency, items, user_data]);

    return null;
}
