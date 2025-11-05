
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Calendar, Users, DollarSign } from "lucide-react";
import { useState } from "react";

interface TourBookingSectionProps {
    dictionary: {
        title: string;
        priceLabel: string;
        bookButton: string;
    };
    price: number;
}

export function TourBookingSection({ dictionary, price }: TourBookingSectionProps) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const BookingForm = (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <DollarSign className="w-6 h-6 text-primary" />
                    <span className="text-lg font-semibold">{dictionary.priceLabel}</span>
                </div>
                <span className="text-3xl font-extrabold text-primary">${price}</span>
            </div>

            <div className="space-y-4">
                 <div>
                    <label className="text-sm font-medium text-muted-foreground">Date</label>
                    <div className="flex items-center gap-3 mt-1 rounded-md border p-3">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <span>Select a date</span>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-muted-foreground">Travelers</label>
                    <div className="flex items-center gap-3 mt-1 rounded-md border p-3">
                        <Users className="w-5 h-5 text-muted-foreground" />
                        <span>2 adults</span>
                    </div>
                </div>
            </div>

            <Button size="lg" className="w-full font-bold text-lg py-7" onClick={() => setIsSheetOpen(false)}>
                {dictionary.bookButton}
            </Button>
        </div>
    );

    return (
        <>
            {/* Desktop View */}
            <Card className="sticky top-28 shadow-lg hidden lg:block">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">{dictionary.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    {BookingForm}
                </CardContent>
            </Card>

            {/* Mobile View */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40">
                <div className="flex items-center justify-between gap-4">
                     <div>
                        <p className="text-sm text-muted-foreground">{dictionary.priceLabel}</p>
                        <p className="text-2xl font-extrabold text-primary">${price}</p>
                    </div>
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button size="lg" className="font-bold text-lg flex-grow">
                                {dictionary.bookButton}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="rounded-t-2xl">
                            <SheetHeader className="mb-4">
                                <SheetTitle className="text-2xl font-bold">{dictionary.title}</SheetTitle>
                            </SheetHeader>
                            {BookingForm}
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </>
    );
}
