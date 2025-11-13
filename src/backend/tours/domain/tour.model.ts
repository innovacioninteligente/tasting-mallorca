export type ItineraryItem = {
    id: string;
    type: 'stop' | 'travel';
    icon: string;
    title: { [key: string]: string };
    duration: string;
    activities: { [key: "en" | "de" | "fr" | "nl"]: string[] };
};

export type PickupPoint = {
    title: { [key: string]: string };
    description: { [key: string]: string };
};

export type TourDetails = {
    highlights: { [key: string]: string };
    fullDescription: { [key: string]: string };
    included: { [key: string]: string };
    notIncluded: { [key: string]: string };
    notSuitableFor: { [key: string]: string };
    whatToBring: { [key: string]: string };
    beforeYouGo: { [key: string]: string };
}

export interface Tour {
  id: string;
  slug: { [key: string]: string };
  title: { [key: string]: string };
  description: { [key: string]: string };
  price: number;
  childPrice: number;
  region: 'North' | 'East' | 'South' | 'West' | 'Central';
  mainImage: string;
  galleryImages: string[];
  durationHours: number;
  overview: { [key: string]: string };
  generalInfo: {
    cancellationPolicy: { [key: string]: string };
    bookingPolicy: { [key: string]: string };
    guideInfo: { [key: string]: string };
    pickupInfo: { [key: string]: string };
  };
  details: TourDetails;
  pickupPoint: PickupPoint;
  itinerary: ItineraryItem[]; 
  availabilityPeriods: {
    startDate: string;
    endDate: string;
    activeDays: string[];
  }[];
  isFeatured: boolean;
  allowDeposit: boolean;
  depositPrice: number;
  published: boolean;
}
