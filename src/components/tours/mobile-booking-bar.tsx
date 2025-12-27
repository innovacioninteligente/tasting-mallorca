'use client';

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface MobileBookingBarProps {
    price: number;
    priceLabel: string; // e.g. "From"
    buttonText: string; // e.g. "Book Now"
    onBook: () => void;
    isVisible?: boolean;
}

export function MobileBookingBar({ price, priceLabel, buttonText, onBook, isVisible = true, children }: MobileBookingBarProps & { children?: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    // If children are provided, we use the Sheet behavior. 
    // If not, we fall back to the onBook callback (scrolling).

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden safe-area-bottom">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground font-medium">{priceLabel}</span>
                                <span className="text-xl font-bold text-primary">€{price}</span>
                            </div>

                            {children ? (
                                <SheetTrigger asChild>
                                    <Button size="lg" className="flex-1 font-semibold text-base shadow-lg">
                                        {buttonText}
                                    </Button>
                                </SheetTrigger>
                            ) : (
                                <Button size="lg" onClick={onBook} className="flex-1 font-semibold text-base shadow-lg">
                                    {buttonText}
                                </Button>
                            )}
                        </div>

                        {children && (
                            <SheetContent side="bottom" className="h-[85vh] overflow-y-auto rounded-t-[20px] px-0 z-50">
                                <div className="px-1 py-2">
                                    {children}
                                </div>
                            </SheetContent>
                        )}
                    </Sheet>
                </div>
            )}
        </AnimatePresence>
    );
}
