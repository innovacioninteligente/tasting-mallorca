
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Users, DollarSign, Minus, Plus, Languages, ArrowLeft, Hotel, CheckCircle, MapPin, Search, X } from "lucide-react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { es, ca, fr, de, nl } from 'date-fns/locale';
import { StripeProvider } from '@/components/stripe-provider';
import CheckoutForm from '@/components/checkout-form';

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
        confirmAndPay: string;
        finalSummary: string;
        total: string;
    };
    price: number;
    lang: string;
    tourTitle: string;
}

const mockHotels = [
  "Can Bordoy Grand House & Garden, Carrer del Forn de la Glòria, 14, Centre, 07012 Palma, Illes Balears, España",
  "MHOUSE Hotel Palma, Carrer de Can Maçanet, 1A, Centre, 07003 Palma, Illes Balears, España",
  "Castillo Hotel Son Vida, a Luxury Collection Hotel, Mallorca, Carrer Raixa, 2, Urbanizacion, Poniente, 07013 Son Vida, Illes Balears, España",
  "Hotel Son Bunyola Villas, Ctra. C, 710, 07191 Banyalbufar, Illes Balears, España",
  "El Llorenç Parc de la Mar (+16), Plaça de Llorenç Villalonga, 4, Centre, 07001 Palma, Illes Balears, España",
  "Meliá Palma Bay, Carrer de Felicià Fuster, 4, Llevant, 07006 Palma, Illes Balears, España",
  "Nakar Hotel, Av. de Jaume III, 21, Centre, 07012 Palma, Illes Balears, España",
  "Concepció by Nobis, C/ de la Concepció, 34, Centre, 07012 Palma, Illes Balears, España"
];

const locales: { [key: string]: Locale } = { es, ca, fr, de, nl };

export function TourBookingSection({ dictionary, price, lang, tourTitle }: TourBookingSectionProps) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [step, setStep] = useState(1);
    
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [language, setLanguage] = useState(lang);
    
    const [isSearchingHotel, setIsSearchingHotel] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedHotel, setSelectedHotel] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const totalParticipants = adults + children;
    const totalPrice = price * totalParticipants;

    const handleNextStep = () => setStep(step + 1);
    const handlePrevStep = () => {
        if (isSearchingHotel) {
            setIsSearchingHotel(false);
        } else {
            setStep(step - 1);
        }
    };
    
    const filteredHotels = searchQuery
    ? mockHotels.filter(hotel =>
        hotel.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockHotels;

    const locale = locales[lang] || es;
    const formattedDate = date ? format(date, "PPP", { locale }) : "Pick a date";

    const getReturnUrl = () => {
        if (typeof window === 'undefined') return '';
        const baseUrl = `${window.location.origin}/${lang}/booking-success`;
        const params = new URLSearchParams({
            tourTitle: tourTitle,
            date: formattedDate,
            participants: totalParticipants.toString(),
            totalPrice: totalPrice.toString(),
            pickupPoint: selectedHotel,
            name: name,
        });
        return `${baseUrl}?${params.toString()}`;
    }


    const Step1 = (
        <motion.div
            key="step1"
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
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
                                classNames={{
                                    day: "text-base h-11 w-11",
                                    head_cell: "text-base w-11",
                                    nav_button: "h-9 w-9"
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
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

    const HotelSearchView = (
        <motion.div
            key="hotel-search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full"
        >
            <div className="flex items-center justify-between p-4 border-b">
                <Button variant="ghost" size="icon" onClick={() => setIsSearchingHotel(false)}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h3 className="text-lg font-bold">{dictionary.searchHotel}</h3>
                <div className="w-9 h-9"></div> 
            </div>
            <div className="p-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={dictionary.searchHotel}
                        className="h-11 text-base pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1 mt-2">
                    {filteredHotels.length > 0 ? (
                        filteredHotels.map((hotel) => (
                            <button
                                key={hotel}
                                className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-3 text-base outline-none hover:bg-accent hover:text-accent-foreground text-left"
                                onClick={() => {
                                    setSelectedHotel(hotel);
                                    setIsSearchingHotel(false);
                                    setSearchQuery("");
                                }}
                            >
                                {hotel}
                            </button>
                        ))
                    ) : (
                        <p className="py-6 text-center text-sm">No hotel found.</p>
                    )}
                </div>
            </div>
        </motion.div>
    );

    const Step2 = (
        <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
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
                     <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between font-normal mt-1 text-base h-11"
                        onClick={() => setIsSearchingHotel(true)}
                    >
                        <div className="flex items-center gap-2 text-left">
                            <Hotel className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{selectedHotel || dictionary.searchHotel}</span>
                        </div>
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
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
                 <Button size="lg" className="w-full font-bold text-lg py-7" onClick={handleNextStep}>
                    {dictionary.continueToPayment}
                </Button>
                 <Button variant="ghost" size="lg" className="w-full" onClick={handlePrevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {dictionary.goBack}
                </Button>
            </div>
        </motion.div>
    );

    const Step3 = (
         <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
             <div className="border border-border bg-secondary/50 rounded-lg p-4 text-base">
                <h4 className="font-bold mb-3">{dictionary.finalSummary}</h4>
                <div className="space-y-2 text-muted-foreground">
                    <div className="flex justify-between"><span>{dictionary.date}:</span> <span className="font-medium text-foreground">{formattedDate}</span></div>
                    <div className="flex justify-between"><span>{dictionary.participants}:</span> <span className="font-medium text-foreground">{totalParticipants}</span></div>
                    <div className="flex justify-between"><span>{dictionary.pickupPoint}:</span> <span className="font-medium text-foreground truncate max-w-[150px]">{selectedHotel}</span></div>
                     <div className="flex justify-between text-lg font-bold text-foreground pt-2 border-t mt-2"><span>{dictionary.total}:</span> <span>€{totalPrice}</span></div>
                </div>
            </div>

            <StripeProvider amount={totalPrice} name={name} email={email}>
                <CheckoutForm dictionary={dictionary} handlePrevStep={handlePrevStep} returnUrl={getReturnUrl()} />
            </StripeProvider>
        </motion.div>
    );

    const renderStep = () => {
        if (isSearchingHotel) return HotelSearchView;
        switch (step) {
            case 1: return Step1;
            case 2: return Step2;
            case 3: return Step3;
            default: return Step1;
        }
    }

    return (
        <>
            <Card className="sticky top-28 shadow-lg hidden lg:block">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">{dictionary.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <AnimatePresence mode="wait">
                        {renderStep()}
                    </AnimatePresence>
                </CardContent>
            </Card>

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
                        <SheetContent side="bottom" className="rounded-t-2xl max-h-[90vh] overflow-y-auto p-0">
                           {isSearchingHotel ? (
                                <div className="h-full"> {renderStep()} </div>
                           ) : (
                             <>
                                <SheetHeader className="p-6 pb-4 text-left">
                                    <SheetTitle className="text-2xl font-bold">{
                                        step === 1 ? dictionary.title :
                                        step === 2 ? dictionary.bookingSummary : dictionary.finalSummary
                                    }</SheetTitle>
                                </SheetHeader>
                                <div className="p-6 pt-0">
                                    <AnimatePresence mode="wait">
                                        {renderStep()}
                                    </AnimatePresence>
                                </div>
                             </>
                           )}
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </>
    );
}

    