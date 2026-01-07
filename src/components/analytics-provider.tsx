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


    if (!consent) {
        return null;
    }

    useEffect(() => {
        if (!consent) return;

        // 1. Google Tag Manager (Base) & Consent Init
        // We load this providing we have AT LEAST decided on consent (even if denied, GTM manages consent signal)
        // OR we can be strict and only load if consent.analytics is true. 
        // Current implementation was: Load GTM Base lazily always? No, strictly usage of consent logic inside.
        // Actually, GTM is best loaded early with 'denied' state.

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

        // GTM Base
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

        // Default Consent (Denied) - Fire immediately if not set
        // Note: Ideally this runs absolutely first, but simple useEffect is acceptable for Client-side nav
        if (typeof window.dataLayer === 'undefined') {
            window.dataLayer = [];
            window.dataLayer.push(['consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied'
            }]);
        }

        // 2. Update Consent based on State
        if (consent.analytics) {
            window.dataLayer.push(['consent', 'update', { 'analytics_storage': 'granted' }]);
        }
        if (consent.marketing) {
            window.dataLayer.push(['consent', 'update', {
                'ad_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted'
            }]);

            // Google Ads Tag
            injectScript('google-ads-script', 'https://www.googletagmanager.com/gtag/js?id=AW-17852397239', null);
            injectScript('google-ads-config', null, `
                 window.dataLayer = window.dataLayer || [];
                 function gtag(){dataLayer.push(arguments);}
                 gtag('js', new Date());
                 gtag('config', 'AW-17852397239');
             `);
        }

        // 3. Meta Pixel (Marketing)
        const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
        if (consent.marketing && PIXEL_ID) {
            injectScript('fb-pixel', null, `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${PIXEL_ID}');
                fbq('track', 'PageView');
            `);
        }

    }, [consent]);

    if (!consent) return null;

    return null; // Render nothing, scripts are injected manually
}
