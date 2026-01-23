'use client';

import { useState, useEffect } from 'react';
// import Script from 'next/script'; // Removed in favor of manual injection
import { usePathname } from 'next/navigation';

import { COOKIE_CONSENT_KEY } from '@/lib/constants';

// Remove the local export


interface ConsentState {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
}

declare global {
    interface Window {
        dataLayer: any[];
    }
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


    // Manual Script Injection (GTM only)
    useEffect(() => {
        if (!consent) return;

        // Manual Injection helper
        const injectScript = (id: string, src: string | null, innerHTML: string | null) => {
            if (document.getElementById(id)) return;
            const script = document.createElement('script');
            script.id = id;
            script.async = true;
            if (src) script.src = src;
            if (innerHTML) script.innerHTML = innerHTML;
            document.head.appendChild(script);
        };

        // GTM Base Container
        const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
        if (GTM_ID) {
            injectScript('gtm-base', null, `
               (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
               new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
               j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
               'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
               })(window,document,'script','dataLayer','${GTM_ID}');
           `);
        }

        // Initialize dataLayer with default consent (denied)
        if (typeof window.dataLayer === 'undefined') {
            window.dataLayer = [];
            window.dataLayer.push(['consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied'
            }]);
        }

        // Update consent based on user preferences
        if (consent.analytics) {
            window.dataLayer.push(['consent', 'update', { 'analytics_storage': 'granted' }]);
        }

        if (consent.marketing) {
            window.dataLayer.push(['consent', 'update', {
                'ad_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted'
            }]);
        }

    }, [consent]);

    if (!consent) {
        return null;
    }

    return null;
}
