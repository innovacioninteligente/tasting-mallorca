
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Cookie } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const COOKIE_CONSENT_KEY = 'cookie_consent';

interface CookieConsentProps {
    dictionary: {
        message: string;
        acceptButton: string;
        declineButton: string;
        privacyPolicy: string;
    },
    lang: string;
}

export function CookieConsent({ dictionary, lang }: CookieConsentProps) {
    const [consent, setConsent] = useState<'pending' | 'accepted' | 'declined'>('pending');

    useEffect(() => {
        try {
            const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
            if (storedConsent === 'accepted' || storedConsent === 'declined') {
                setConsent(storedConsent);
            }
        } catch (error) {
            console.error('Could not access localStorage for cookie consent.');
        }
    }, []);

    const handleAccept = () => {
        try {
            localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
        } catch (error) {
            console.error('Could not save cookie consent to localStorage.');
        }
        setConsent('accepted');
    };

    const handleDecline = () => {
        try {
            localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
        } catch (error) {
            console.error('Could not save cookie consent to localStorage.');
        }
        setConsent('declined');
    };

    return (
        <AnimatePresence>
            {consent === 'pending' && (
                <motion.div
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    exit={{ y: '100%', opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed bottom-4 left-4 right-4 md:left-auto md:max-w-lg z-50"
                >
                    <Card className="shadow-2xl border-border/50 bg-background/80 backdrop-blur-lg">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center gap-6">
                                <Cookie className="w-10 h-10 text-primary flex-shrink-0 hidden md:block" />
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {dictionary.message}{' '}
                                        <Link href={`/${lang}/legal/cookie-policy`} className="underline hover:text-primary">
                                            {dictionary.privacyPolicy}.
                                        </Link>
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                <Button onClick={handleAccept} className="w-full font-semibold">{dictionary.acceptButton}</Button>
                                <Button onClick={handleDecline} variant="secondary" className="w-full font-semibold">{dictionary.declineButton}</Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

