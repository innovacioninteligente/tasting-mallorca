

'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Users, DollarSign, Minus, Plus, Languages, ArrowLeft, Hotel, CheckCircle, MapPin, Search, X, CreditCard, Banknote, Info, User as UserIcon, Phone, Baby, PersonStanding, ImageIcon } from "lucide-react";
import NextImage from "next/image";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, isWithinInterval, parseISO } from "date-fns";
import { fr, de, nl, enUS, es } from 'date-fns/locale';
import { AnimatePresence, motion } from "framer-motion";
import { StripeProvider } from '@/components/stripe-provider';
import CheckoutForm from '@/components/checkout-form';
import { Hotel as HotelModel } from "@/backend/hotels/domain/hotel.model";
import { MeetingPoint } from "@/backend/meeting-points/domain/meeting-point.model";
import { useUser, useFirestore } from "@/firebase";
import { Tour } from "@/backend/tours/domain/tour.model";
import { doc, setDoc } from "firebase/firestore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { type Locale } from '@/dictionaries/config';


interface TourBookingSectionProps {
    dictionary: {
        title: string;
        priceLabel: string;
        bookButton: string;
        checkAvailability: string;
        participants: string;
        adults: string;
        children: string;
        infants: string;
        date: string;
        language: string;
        bookingSummary: string;
        pickupPoint: string;
        searchHotel: string;
        suggestedPickup: string;
        yourName: string;
        yourEmail: string;
        yourPhone: string;
        continueToPayment: string;
        goBack: string;
        confirmAndPay: string;
        finalSummary: string;
        total: string;
        paymentOption: string;
        payFull: string;
        payDeposit: string;
        payFullTooltip: string;
        payDepositTooltip: string;
        mostPopular: string;
        availabilityInfo: string;
        operatesOn: string;
        from: string;
        to: string;
        and: string;
    };
    tour: Tour;
    lang: string;
    hotels: HotelModel[];
    meetingPoints: MeetingPoint[];
}

const locales: { [key in Locale]?: any } = { en: enUS, fr, de, nl, es };

const dayNameToIndex: { [key: string]: number } = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
};

const getInitialState = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
        const item = window.localStorage.getItem(key);
        if (!item) return defaultValue;
        
        const parsed = JSON.parse(item);
        if (key.toLowerCase().includes('date') && typeof parsed === 'string') {
            return new Date(parsed) as T;
        }
        return parsed;
    } catch (error) {
        console.warn(`Error reading localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

export function TourBookingSection({ dictionary, tour, lang, hotels, meetingPoints }: TourBookingSectionProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isBookingFlowActive, setIsBookingFlowActive] = useState(false);
    const [step, setStep] = useState(1);
    
    const bookingCacheKey = `booking-form-${tour.id}`;

    const [adults, setAdults] = useState<number>(() => getInitialState(`${bookingCacheKey}-adults`, 2));
    const [children, setChildren] = useState<number>(() => getInitialState(`${bookingCacheKey}-children`, 0));
    const [infants, setInfants] = useState<number>(() => getInitialState(`${bookingCacheKey}-infants`, 0));
    const [date, setDate] = useState<Date | undefined>(() => getInitialState(`${bookingCacheKey}-date`, undefined));
    const [language, setLanguage] = useState<string>(() => getInitialState(`${bookingCacheKey}-language`, lang));
    const [paymentOption, setPaymentOption] = useState<'full' | 'deposit'>(() => getInitialState(`${bookingCacheKey}-paymentOption`, 'full'));
    const [selectedHotel, setSelectedHotel] = useState<HotelModel | null>(() => getInitialState(`${bookingCacheKey}-hotel`, null));
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    
    const [bookingId, setBookingId] = useState<string | null>(null);
    const [isSearchingHotel, setIsSearchingHotel] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        try {
            localStorage.setItem(`${bookingCacheKey}-adults`, JSON.stringify(adults));
            localStorage.setItem(`${bookingCacheKey}-children`, JSON.stringify(children));
            localStorage.setItem(`${bookingCacheKey}-infants`, JSON.stringify(infants));
            if(date) localStorage.setItem(`${bookingCacheKey}-date`, JSON.stringify(date));
            localStorage.setItem(`${bookingCacheKey}-language`, JSON.stringify(language));
            localStorage.setItem(`${bookingCacheKey}-paymentOption`, JSON.stringify(paymentOption));
            if (selectedHotel) localStorage.setItem(`${bookingCacheKey}-hotel`, JSON.stringify(selectedHotel));
        } catch (error) {
            console.warn("Could not save booking form state to localStorage", error);
        }
    }, [adults, children, infants, date, language, paymentOption, selectedHotel, bookingCacheKey]);

    const totalParticipants = adults + children + infants;
    const totalPrice = (tour.price * adults) + (tour.childPrice * children);
    const depositPrice = tour.allowDeposit && tour.depositPrice ? tour.depositPrice * (adults + children) : 0;
    
    const amountToPay = paymentOption === 'deposit' ? depositPrice : totalPrice;

    const suggestedMeetingPoint = selectedHotel?.assignedMeetingPointId
        ? meetingPoints.find(mp => mp.id === selectedHotel.assignedMeetingPointId)
        : null;

    const handleContinueToPayment = async () => {
        if (!firestore || !date || !selectedHotel || !suggestedMeetingPoint || !customerName || !customerEmail || !customerPhone) return;
        
        const newBookingId = crypto.randomUUID();
        setBookingId(newBookingId);
        
        const bookingData = {
            id: newBookingId,
            tourId: tour.id,
            userId: user?.uid || 'anonymous',
            date: date,
            adults,
            children,
            infants,
            language: language,
            hotelId: selectedHotel.id,
            hotelName: selectedHotel.name,
            meetingPointId: suggestedMeetingPoint.id,
            meetingPointName: suggestedMeetingPoint.name,
            totalPrice: totalPrice,
            amountPaid: 0,
            amountDue: totalPrice,
            paymentType: paymentOption,
            status: 'pending' as 'pending',
            ticketStatus: 'valid' as 'valid',
            customerName,
            customerEmail,
            customerPhone,
        };

        try {
            await setDoc(doc(firestore, "bookings", newBookingId), bookingData);
            setStep(step + 1);
        } catch (error) {
            console.error("Error creating pending booking:", error);
        }
    };
    
    const handleStartBooking = () => {
        if (!date) return;
        setIsBookingFlowActive(true);
        setStep(2);
    }

    const handlePrevStep = () => {
        if (isSearchingHotel) {
            setIsSearchingHotel(false);
        } else {
             if (step === 2) {
                 setIsBookingFlowActive(false);
             }
             if (step > 1) {
                setStep(step - 1);
             }
        }
    };
    
    const filteredHotels = searchQuery
    ? hotels.filter(hotel =>
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (hotel.address && hotel.address.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : hotels;

    const locale = locales[lang as Locale] || enUS;
    const formattedDate = date ? format(date, "PPP", { locale }) : "Pick a date";

    const getReturnUrl = () => {
        if (typeof window === 'undefined' || !bookingId) return '';
        const baseUrl = `${window.location.origin}/${lang}/booking-success?booking_id=${bookingId}`;
        
        localStorage.removeItem(`${bookingCacheKey}-adults`);
        localStorage.removeItem(`${bookingCacheKey}-children`);
        localStorage.removeItem(`${bookingCacheKey}-infants`);
        localStorage.removeItem(`${bookingCacheKey}-date`);
        localStorage.removeItem(`${bookingCacheKey}-language`);
        localStorage.removeItem(`${bookingCacheKey}-paymentOption`);
        localStorage.removeItem(`${bookingCacheKey}-hotel`);

        return baseUrl;
    }

    const paymentMetadata = {
        bookingId: bookingId || '',
        tourId: tour.id,
        userId: user?.uid || 'anonymous',
        totalPrice: totalPrice.toString(),
        paymentType: paymentOption,
    };
    
    const isDateDisabled = (day: Date): boolean => {
        if (!tour.availabilityPeriods || tour.availabilityPeriods.length === 0) {
            return false;
        }
    
        const dayOfWeek = day.getDay();
    
        for (const period of tour.availabilityPeriods) {
            const start = parseISO(period.startDate);
            const end = parseISO(period.endDate);
    
            if (isWithinInterval(day, { start, end })) {
                const activeWeekDays = period.activeDays.map(d => dayNameToIndex[d]);
                if (activeWeekDays.includes(dayOfWeek)) {
                    return false;
                }
            }
        }
        return true;
    };
    
     const availabilitySummary = tour.availabilityPeriods?.map((period, index) => {
        const start = format(parseISO(period.startDate), 'dd MMM', { locale });
        const end = format(parseISO(period.endDate), 'dd MMM', { locale });
        const days = period.activeDays.join(', ');
        return `${dictionary.operatesOn} ${days} ${dictionary.from} ${start} ${dictionary.to} ${end}`;
    }).join(` ${dictionary.and} `);


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
                    <span className="text-lg font-semibold">{dictionary.priceLabel}</span>
                </div>
                <span className="text-3xl font-extrabold text-primary">€{tour.price}</span>
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
                        <PopoverContent className="w-80">
                           <div className="space-y-4">
                               <div className="flex items-center justify-between">
                                   <div className="flex items-center gap-2">
                                       <PersonStanding className="h-5 w-5" />
                                       <div>
                                            <span className="font-medium">{dictionary.adults}</span>
                                            <p className="text-xs text-muted-foreground">{'>13 yrs'}</p>
                                       </div>
                                   </div>
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
                                    <div className="flex items-center gap-2">
                                        <PersonStanding className="h-4 w-4" />
                                        <div>
                                            <span className="font-medium">{dictionary.children}</span>
                                            <p className="text-xs text-muted-foreground">{'3-12 yrs'}</p>
                                        </div>
                                   </div>
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
                               <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Baby className="h-5 w-5" />
                                         <div>
                                            <span className="font-medium">{dictionary.infants || 'Infants'}</span>
                                            <p className="text-xs text-muted-foreground">{'0-2 yrs'}</p>
                                        </div>
                                   </div>
                                   <div className="flex items-center gap-2">
                                       <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setInfants(Math.max(0, infants - 1))}>
                                           <Minus className="h-4 w-4" />
                                       </Button>
                                       <span>{infants}</span>
                                       <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setInfants(infants + 1)}>
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
                                {date ? formattedDate : "Pick a date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                disabled={isDateDisabled}
                                initialFocus
                                classNames={{
                                    day: "text-base h-11 w-11",
                                    head_cell: "text-base w-11",
                                    nav_button: "h-9 w-9"
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                     {availabilitySummary && (
                        <Alert variant="default" className="mt-2 text-sm bg-secondary/50">
                            <Info className="h-4 w-4" />
                            <AlertTitle className="font-semibold">{dictionary.availabilityInfo}</AlertTitle>
                            <AlertDescription>
                                {availabilitySummary}
                            </AlertDescription>
                        </Alert>
                    )}
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
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                            <SelectItem value="nl">Nederlands</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <Button size="lg" className="w-full font-bold text-lg py-7 bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleStartBooking} disabled={!date}>
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
                                key={hotel.id}
                                className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-3 text-base outline-none hover:bg-accent hover:text-accent-foreground text-left"
                                onClick={() => {
                                    setSelectedHotel(hotel);
                                    setIsSearchingHotel(false);
                                    setSearchQuery("");
                                }}
                            >
                                {hotel.name}
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
                    <span>{date ? formattedDate : '...'}</span>
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
                            <span className="truncate">{selectedHotel?.name || dictionary.searchHotel}</span>
                        </div>
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                    {suggestedMeetingPoint && (
                        <div className="mt-2 text-sm text-muted-foreground flex items-start gap-3 p-3 bg-secondary/30 rounded-md border border-primary/20">
                            <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"/>
                            <div>
                                <span className="font-semibold text-foreground">{dictionary.suggestedPickup}:</span>
                                <p>{suggestedMeetingPoint.name}</p>
                                <p className="text-xs">{suggestedMeetingPoint.address}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <Label htmlFor="customerName" className="text-base font-medium text-muted-foreground">{dictionary.yourName}</Label>
                    <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Full Name" className="h-11 text-base" />
                    
                    <Label htmlFor="customerEmail" className="text-base font-medium text-muted-foreground">{dictionary.yourEmail}</Label>
                    <Input id="customerEmail" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="your@email.com" className="h-11 text-base" />
                    
                    <Label htmlFor="customerPhone" className="text-base font-medium text-muted-foreground">{dictionary.yourPhone || 'Your Phone'}</Label>
                    <Input id="customerPhone" type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="+34 123 456 789" className="h-11 text-base" />
                </div>


                {tour.allowDeposit && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                             <label className="text-base font-medium text-muted-foreground">{dictionary.paymentOption}</label>
                             <TooltipProvider>
                                 <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="h-4 w-4 text-muted-foreground cursor-help"/>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <p>{dictionary.payDepositTooltip}</p>
                                    </TooltipContent>
                                 </Tooltip>
                             </TooltipProvider>
                        </div>
                        <RadioGroup defaultValue={paymentOption} value={paymentOption} className="mt-2 grid grid-cols-2 gap-4" onValueChange={(value: 'full' | 'deposit') => setPaymentOption(value)}>
                                <div>
                                    <RadioGroupItem value="full" id="r1" className="peer sr-only" />
                                    <Label htmlFor="r1" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent peer-data-[state=checked]:text-accent-foreground [&:has([data-state=checked])]:border-primary relative">
                                        <Banknote className="mb-3 h-6 w-6" />
                                        {dictionary.payFull}
                                        <span className="font-bold text-lg mt-1">€{totalPrice.toFixed(2)}</span>
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem value="deposit" id="r2" className="peer sr-only" />
                                    <Label htmlFor="r2" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent peer-data-[state=checked]:text-accent-foreground [&:has([data-state=checked])]:border-primary relative">
                                        <div className="absolute top-1 right-1.5 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">{dictionary.mostPopular}</div>
                                        <CreditCard className="mb-3 h-6 w-6" />
                                        {dictionary.payDeposit}
                                        <span className="font-bold text-lg mt-1">€{depositPrice.toFixed(2)}</span>
                                    </Label>
                                </div>
                        </RadioGroup>
                    </div>
                )}
            </div>
            <div className="space-y-3">
                 <Button size="lg" className="w-full font-bold text-lg py-7 bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleContinueToPayment} disabled={!selectedHotel || !suggestedMeetingPoint || !customerName || !customerEmail || !customerPhone}>
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
                    <div className="flex justify-between"><span>{dictionary.date}:</span> <span className="font-medium text-foreground">{date ? formattedDate : '...'}</span></div>
                    <div className="flex justify-between"><span>{dictionary.participants}:</span> <span className="font-medium text-foreground">{totalParticipants}</span></div>
                    <div className="flex justify-between"><span>{dictionary.pickupPoint}:</span> <span className="font-medium text-foreground truncate max-w-[150px]">{selectedHotel?.name}</span></div>
                    <div className="flex justify-between text-lg font-bold text-foreground pt-2 border-t mt-2">
                        <span>{paymentOption === 'deposit' ? dictionary.payDeposit : dictionary.total}:</span>
                        <span>€{amountToPay.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {bookingId && (
                <StripeProvider
                    key={bookingId}
                    amount={amountToPay}
                    name={customerName || 'Customer'}
                    email={customerEmail || 'anonymous'}
                    metadata={paymentMetadata}
                >
                    <CheckoutForm dictionary={dictionary} handlePrevStep={handlePrevStep} returnUrl={getReturnUrl()} />
                </StripeProvider>
            )}
        </motion.div>
    );

    const renderBookingFlow = () => {
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
            {/* --- Desktop Booking Card --- */}
            <div className="sticky top-28 shadow-lg hidden lg:block">
                 <AnimatePresence>
                    { !isBookingFlowActive && (
                        <motion.div
                             key="initial-card"
                             initial={{ opacity: 0, scale: 0.98 }}
                             animate={{ opacity: 1, scale: 1 }}
                             exit={{ opacity: 0, scale: 0.98 }}
                             transition={{ duration: 0.2 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold">{dictionary.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {Step1}
                                </CardContent>
                            </Card>
                        </motion.div>
                     )}
                 </AnimatePresence>
            </div>
            <AnimatePresence>
                {isBookingFlowActive && (
                <div
                    className="hidden lg:flex fixed inset-0 bg-black/60 backdrop-blur-sm z-50 items-center justify-center p-4 md:p-8"
                    onClick={() => setIsBookingFlowActive(false)}
                >
                    <motion.div
                        key="expanded-card"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex max-w-4xl w-full max-h-[90vh] bg-background rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="hidden md:block bg-secondary p-8 rounded-l-lg w-2/5">
                             <h3 className="text-2xl font-bold">{tour.title[lang] || tour.title.en}</h3>
                             <p className="text-muted-foreground mt-2">{tour.description[lang] || tour.description.en}</p>
                             <div className="relative h-64 mt-8 rounded-lg overflow-hidden">
                                 <NextImage src={tour.mainImage} alt={tour.title.en} fill className="object-cover" />
                             </div>
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                           <div className="p-6 border-b shrink-0">
                                <CardTitle className="text-2xl font-bold">{
                                    isSearchingHotel ? dictionary.searchHotel :
                                    step === 2 ? dictionary.bookingSummary :
                                    step === 3 ? dictionary.finalSummary : dictionary.title
                                }</CardTitle>
                            </div>
                             <div className="flex-1 p-6 min-h-0 overflow-y-auto">
                                <AnimatePresence mode="wait">
                                    {renderBookingFlow()}
                                </AnimatePresence>
                            </div>
                        </div>
                     </motion.div>
                </div>
                )}
            </AnimatePresence>


            {/* --- Mobile Booking Sheet --- */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50">
                <div className="flex items-center justify-between gap-4">
                     <div>
                        <p className="text-sm text-muted-foreground">{dictionary.priceLabel}</p>
                        <p className="text-2xl font-extrabold text-primary">€{tour.price.toFixed(2)}</p>
                    </div>
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button size="lg" className="font-bold text-lg flex-grow bg-accent text-accent-foreground hover:bg-accent/90">
                                {dictionary.bookButton}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="rounded-t-2xl max-h-[90vh] p-0 flex flex-col">
                           {isSearchingHotel ? (
                                <div className="h-full"> {renderBookingFlow()} </div>
                           ) : (
                             <>
                                <SheetHeader className="p-6 pb-4 text-left border-b sticky top-0 bg-background z-10">
                                    <div className="flex justify-between items-center">
                                        <SheetTitle className="text-2xl font-bold">{
                                            step === 1 ? dictionary.title :
                                            step === 2 ? dictionary.bookingSummary : dictionary.finalSummary
                                        }</SheetTitle>
                                        <SheetClose asChild>
                                            <Button variant="ghost" size="icon" className="rounded-full">
                                                <X className="h-5 w-5" />
                                            </Button>
                                        </SheetClose>
                                    </div>
                                    <SheetDescription />
                                </SheetHeader>
                                <div className="p-6 pt-4 overflow-y-auto flex-grow">
                                    <AnimatePresence mode="wait">
                                        {renderBookingFlow()}
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

    