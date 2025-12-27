'use client';

import dynamic from 'next/dynamic';
import { ComponentProps } from 'react';
import { CookieConsent } from './cookie-consent';

const DynamicCookieConsent = dynamic(
    () => import('./cookie-consent').then((mod) => mod.CookieConsent),
    { ssr: false }
);

export function ClientCookieConsent(props: ComponentProps<typeof CookieConsent>) {
    return <DynamicCookieConsent {...props} />;
}
