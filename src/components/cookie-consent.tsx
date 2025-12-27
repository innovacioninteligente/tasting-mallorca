'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Cookie } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { CookieSettingsDialog } from './cookie-settings';
import { COOKIE_CONSENT_KEY } from '@/lib/constants';

interface CookieConsentProps {
    dictionary: {
        message: string;
        acceptButton: string;
        declineButton: string;
        customizeButton: string;
        privacyPolicy: string;
    },
    lang: string;
}

export function CookieConsent({ dictionary, lang }: CookieConsentProps) {
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        try {
            const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
            if (!storedConsent) {
                setShowBanner(true);
            }
        } catch (error) {
            console.error('Could not access localStorage for cookie consent.');
        }
    }, []);

    const handleAccept = () => {
        try {
            const consent = { necessary: true, analytics: true, marketing: true, timestamp: new Date().toISOString() };
            localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
            window.dispatchEvent(new Event('storage')); // Trigger update in AnalyticsProvider
        } catch (error) {
            console.error('Could not save cookie consent to localStorage.');
        }
        setShowBanner(false);
    };

    const handleDecline = () => {
        try {
            const consent = { necessary: true, analytics: false, marketing: false, timestamp: new Date().toISOString() };
            localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
            window.dispatchEvent(new Event('storage'));
        } catch (error) {
            console.error('Could not save cookie consent to localStorage.');
        }
        setShowBanner(false);
    };

    return (
        <>
            <AnimatePresence>
                {showBanner && (
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
                                    <Button onClick={() => setShowSettings(true)} variant="secondary" className="w-full font-semibold">{dictionary.customizeButton}</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
            <CookieSettingsDialog
                isOpen={showSettings}
                setIsOpen={setShowSettings}
                onSave={() => setShowBanner(false)}
            />
        </>
    );
}
