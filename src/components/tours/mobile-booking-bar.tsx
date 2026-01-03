
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tour } from '@/backend/tours/domain/tour.model';
import { Locale } from '@/dictionaries/config';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface MobileBookingBarProps {
    tour: Tour;
    dictionary: any;
    onBookClick: () => void;
    lang: Locale;
}

export function MobileBookingBar({ tour, dictionary, onBookClick, lang }: MobileBookingBarProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show bar after scrolling past the first 300px
            const sho = window.scrollY > 300;
            setIsVisible(sho);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-md border-t border-border shadow-[0_-5px_10px_rgba(0,0,0,0.05)] md:hidden safe-area-bottom"
                >
                    <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">From</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-extrabold text-primary">€{tour.price}</span>
                                <span className="text-xs text-muted-foreground line-through opacity-70">€{Math.round(tour.price * 1.2)}</span>
                            </div>
                        </div>
                        <Button
                            onClick={onBookClick}
                            size="lg"
                            className="flex-1 font-bold text-base py-6 shadow-lg shadow-primary/25 animate-pulse-subtle bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {dictionary.bookButton || "Book Now"}
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
