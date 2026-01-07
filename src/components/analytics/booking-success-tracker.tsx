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

// Google Ads Conversion Labels by Language
const GOOGLE_ADS_LABELS: Record<string, string> = {
    de: 'AW-17852397239/5VzgCKH00dwbELft18BC', // German
    en: 'AW-17852397239/5VzgCKH00dwbELft18BC', // English
    default: 'AW-17852397239/5VzgCKH00dwbELft18BC'
};

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

        // 1. GTM Purchase Event (Generic)
        if (typeof window !== 'undefined' && window.dataLayer) {
            window.dataLayer.push({
                event: 'purchase',
                ecommerce: {
                    transaction_id: transactionId,
                    value: value,
                    currency: currency,
                    items: items,
                    user_data: {
                        email: user_data?.email_hashed,
                        phone: user_data?.phone_hashed
                    }
                }
            });

            // 2. Google Ads Conversion Event (Language Optimized)
            const conversionLabel = GOOGLE_ADS_LABELS[lang] || GOOGLE_ADS_LABELS.default;
            const gtag = (window as any).gtag || function () { (window.dataLayer || []).push(arguments); };

            gtag('event', 'conversion', {
                'send_to': conversionLabel,
                'value': value,
                'currency': currency,
                'transaction_id': transactionId
            });

            // 3. Meta Pixel (Client-side)
            const fbq = (window as any).fbq;
            if (fbq) {
                fbq('track', 'Purchase', {
                    value: value,
                    currency: currency,
                    content_ids: items.map(i => i.item_id),
                    content_type: 'product',
                    num_items: items.length
                }, { eventID: transactionId }); // Deduplication key
            }

            // 4. Meta CAPI (Server-side)
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

            console.log('Events fired (GTM, Ads, Meta):', { transactionId, value, lang, conversionLabel });
            firedRef.current = true;
        }
    }, [transactionId, value, currency, items, user_data, lang]);

    return null;
}
