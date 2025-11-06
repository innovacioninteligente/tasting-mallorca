'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Users, DollarSign, Minus, Plus, Languages } from "lucide-react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

interface TourBookingSectionProps {
    dictionary: {
        title: string;
        priceLabel: string;
        bookButton: string;
        checkAvailability: string;
        participants: string;
        adults: string;
        children: string;
        date: string;
        language: string;
    };
    price: number;
}

export function TourBookingSection({ dictionary, price }: TourBookingSectionProps) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [date, setDate] = useState<Date | undefined>(new Date());

    const totalParticipants = adults + children;

    const BookingForm = (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <DollarSign className="w-6 h-6 text-primary" />
                    <span className="text-lg font-semibold">{dictionary.priceLabel}</span>
                </div>
                <span className="text-3xl font-extrabold text-primary">€{price}</span>
            </div>

            <div className="space-y-4">
                {/* Participants Popover */}
                <div>
                     <label className="text-sm font-medium text-muted-foreground">{dictionary.participants}</label>
                     <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                                <Users className="mr-2 h-4 w-4" />
                                <span>{totalParticipants} {dictionary.participants.toLowerCase()}</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60">
                           <div className="space-y-4">
                               <div className="flex items-center justify-between">
                                   <span className="font-medium">{dictionary.adults}</span>
                                   <div className="flex items-center gap-2">
                                       <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setAdults(Math.max(1, adults - 1))}>
                                           <Minus className="h-4 w-4" />
                                       </Button>
                                       <span>{adults}</span>
                                       <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setAdults(adults + 1)}>
                                           <Plus className="h-4 w-4" />
                                       </Button>
                                   </div>
                               </div>
                                <div className="flex items-center justify-between">
                                   <span className="font-medium">{dictionary.children}</span>
                                   <div className="flex items-center gap-2">
                                       <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setChildren(Math.max(0, children - 1))}>
                                           <Minus className="h-4 w-4" />
                                       </Button>
                                       <span>{children}</span>
                                       <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setChildren(children + 1)}>
                                           <Plus className="h-4 w-4" />
                                       </Button>
                                   </div>
                               </div>
                           </div>
                        </PopoverContent>
                     </Popover>
                </div>

                {/* Date Picker */}
                <div>
                    <label className="text-sm font-medium text-muted-foreground">{dictionary.date}</label>
                     <Popover>
                        <PopoverTrigger asChild>
                           <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                
                 {/* Language Selector */}
                <div>
                     <label className="text-sm font-medium text-muted-foreground">{dictionary.language}</label>
                     <Select defaultValue="en">
                        <SelectTrigger className="w-full mt-1">
                            <Languages className="mr-2 h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="ca">Català</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                            <SelectItem value="nl">Nederlands</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Button size="lg" className="w-full font-bold text-lg py-7" onClick={() => setIsSheetOpen(false)}>
                {dictionary.checkAvailability}
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
                        <p className="text-2xl font-extrabold text-primary">€{price}</p>
                    </div>
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button size="lg" className="font-bold text-lg flex-grow">
                                {dictionary.bookButton}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="rounded-t-2xl max-h-[90vh] overflow-y-auto">
                            <SheetHeader className="mb-4">
                                <SheetTitle className="text-2xl font-bold">{dictionary.title}</SheetTitle>
                            </SheetHeader>
                            <div className="p-1">
                               {BookingForm}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </>
    );
}
