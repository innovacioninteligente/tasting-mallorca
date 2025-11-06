'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Users, DollarSign, Minus, Plus, Languages, ArrowLeft, Hotel, CheckCircle, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { es, ca, fr, de, nl } from 'date-fns/locale';

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
        bookingSummary: string;
        pickupPoint: string;
        searchHotel: string;
        suggestedPickup: string;
        yourName: string;
        yourEmail: string;
        continueToPayment: string;
        goBack: string;
    };
    price: number;
    lang: string;
}

const mockHotels = [
  "Iberostar Selection Llaüt Palma",
  "Hipotels Gran Playa de Palma",
  "Secrets Mallorca Villamil Resort & Spa",
  "St. Regis Mardavall Mallorca Resort",
  "Zafiro Palace Palmanova",
  "Pure Salt Port Adriano",
  "Cap Rocat",
  "Castell Son Claret"
];

const locales: { [key: string]: Locale } = { es, ca, fr, de, nl };

export function TourBookingSection({ dictionary, price, lang }: TourBookingSectionProps) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [step, setStep] = useState(1);
    
    // Step 1 State
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [language, setLanguage] = useState(lang);
    
    // Step 2 State
    const [openHotelSearch, setOpenHotelSearch] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const totalParticipants = adults + children;

    const handleNextStep = () => setStep(step + 1);
    const handlePrevStep = () => setStep(step - 1);

    const locale = locales[lang];
    const formattedDate = date ? format(date, "PPP", { locale }) : "Pick a date";

    const Step1 = (
        <motion.div
            key="step1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
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
                            <Button variant="outline" className="w-full justify-start text-left font-normal mt-1 text-base h-11">
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
                           <Button variant="outline" className="w-full justify-start text-left font-normal mt-1 text-base h-11">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formattedDate}
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
                     <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-full mt-1 text-base h-11">
                            <div className="flex items-center gap-2">
                                <Languages className="h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Select a language" />
                            </div>
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

            <Button size="lg" className="w-full font-bold text-lg py-7" onClick={handleNextStep}>
                {dictionary.checkAvailability}
            </Button>
        </motion.div>
    );

    const Step2 = (
         <motion.div
            key="step2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
             <div className="border border-border bg-secondary/50 rounded-lg p-3 text-base">
                <h4 className="font-bold mb-2">{dictionary.bookingSummary}</h4>
                <div className="flex justify-between items-center text-muted-foreground">
                    <span>{formattedDate}</span>
                    <span>{totalParticipants} {dictionary.participants.toLowerCase()}</span>
                </div>
            </div>
            
            <div className="space-y-4">
                 <div>
                    <label className="text-base font-medium text-muted-foreground">{dictionary.pickupPoint}</label>
                     <Dialog open={openHotelSearch} onOpenChange={setOpenHotelSearch}>
                        <DialogTrigger asChild>
                             <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openHotelSearch}
                                className="w-full justify-between font-normal mt-1 text-base h-11"
                                >
                                <div className="flex items-center gap-2">
                                    <Hotel className="h-4 w-4" />
                                    <span className="truncate">{selectedHotel || dictionary.searchHotel}</span>
                                </div>
                                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                             <DialogHeader>
                                <DialogTitle>{dictionary.searchHotel}</DialogTitle>
                            </DialogHeader>
                            <Command>
                                <CommandInput placeholder={dictionary.searchHotel} />
                                <CommandList>
                                    <CommandEmpty>No hotel found.</CommandEmpty>
                                    <CommandGroup>
                                        {mockHotels.map((hotel) => (
                                        <CommandItem
                                            key={hotel}
                                            value={hotel}
                                            onSelect={(currentValue) => {
                                                setSelectedHotel(currentValue === selectedHotel ? "" : currentValue)
                                                setOpenHotelSearch(false)
                                            }}
                                        >
                                            <CheckCircle
                                                className={`mr-2 h-4 w-4 ${selectedHotel === hotel ? "opacity-100" : "opacity-0"}`}
                                            />
                                            {hotel}
                                        </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </DialogContent>
                    </Dialog>
                    {selectedHotel && (
                        <div className="mt-2 text-sm text-muted-foreground flex items-start gap-3 p-3 bg-secondary/30 rounded-md border border-primary/20">
                            <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"/>
                            <div>
                                <span className="font-semibold text-foreground">{dictionary.suggestedPickup}:</span>
                                <p>Meeting Point - Parque Infantil de Tráfico</p>
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="name" className="text-base font-medium text-muted-foreground">{dictionary.yourName}</label>
                    <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 text-base h-11" />
                </div>
                 <div>
                    <label htmlFor="email" className="text-base font-medium text-muted-foreground">{dictionary.yourEmail}</label>
                    <Input id="email" type="email" placeholder="john.doe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 text-base h-11" />
                </div>
            </div>

            <div className="space-y-3">
                 <Button size="lg" className="w-full font-bold text-lg py-7">
                    {dictionary.continueToPayment}
                </Button>
                 <Button variant="ghost" size="lg" className="w-full" onClick={handlePrevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {dictionary.goBack}
                </Button>
            </div>
        </motion.div>
    );

    const BookingForm = (
        <AnimatePresence mode="wait">
            {step === 1 && Step1}
            {step === 2 && Step2}
        </AnimatePresence>
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
                            <SheetHeader className="mb-4 text-left">
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

    