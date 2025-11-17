'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

export const COOKIE_CONSENT_KEY = 'cookie_consent_preferences';

interface ConsentState {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
}

export function AnalyticsProvider() {
    const [consent, setConsent] = useState<ConsentState | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const checkConsent = () => {
            try {
                const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
                if (storedConsent) {
                    setConsent(JSON.parse(storedConsent));
                } else {
                    setConsent({ necessary: true, analytics: false, marketing: false });
                }
            } catch (error) {
                console.error('Could not access localStorage for cookie consent.');
                setConsent({ necessary: true, analytics: false, marketing: false });
            }
        };

        checkConsent();

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === COOKIE_CONSENT_KEY) {
                checkConsent();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);

    }, []);

    // Effect for handling page views for analytics when the route changes
    useEffect(() => {
        const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
        if (consent?.analytics && GTM_ID && typeof window.dataLayer !== 'undefined') {
            window.dataLayer.push({
                event: 'pageview',
                page: pathname,
            });
        }
    }, [pathname, consent]);


    if (!consent) {
        return null;
    }
    
    const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

    return (
        <>
            {/* Google Tag Manager - Base script always loaded */}
            <Script id="gtm-base" strategy="afterInteractive">
                {`
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','${GTM_ID}');
                `}
            </Script>

             {/* Consent update script */}
            <Script id="gtm-consent-init" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('consent', 'default', {
                        'ad_storage': 'denied',
                        'ad_user_data': 'denied',
                        'ad_personalization': 'denied',
                        'analytics_storage': 'denied'
                    });
                `}
            </Script>
            
            {consent.analytics && (
                 <Script id="gtm-consent-analytics" strategy="afterInteractive">
                    {`
                        gtag('consent', 'update', {
                            'analytics_storage': 'granted'
                        });
                    `}
                </Script>
            )}

             {consent.marketing && (
                 <Script id="gtm-consent-marketing" strategy="afterInteractive">
                    {`
                        gtag('consent', 'update', {
                            'ad_storage': 'granted',
                            'ad_user_data': 'granted',
                            'ad_personalization': 'granted'
                        });
                    `}
                </Script>
            )}
        </>
    );
}
