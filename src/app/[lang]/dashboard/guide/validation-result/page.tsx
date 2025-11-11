
'use server';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { GuideRouteGuard } from '@/components/auth/guide-route-guard';
import { getDictionary } from '@/dictionaries/get-dictionary';
import { Locale } from '@/dictionaries/config';
import { ValidationResultClient } from './validation-result-client';


// Server Component Wrapper
export default async function ValidationResultPage({ params: { lang } }: { params: { lang: Locale }}) {
    const dictionary = await getDictionary(lang);

    return (
        <GuideRouteGuard>
            <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
                <ValidationResultClient dictionary={dictionary.dashboard.validationResult} lang={lang} />
            </Suspense>
        </GuideRouteGuard>
    );
}
