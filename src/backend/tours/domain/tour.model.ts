
export interface Tour {
  id: string;
  slug: { [key: string]: string };
  title: { [key: string]: string };
  description: { [key: string]: string };
  price: number;
  region: 'North' | 'East' | 'South' | 'West' | 'Central';
  mainImage: string;
  galleryImages: string[];
  durationHours: number;
  overview: { [key: string]: string };
  itinerary: { [key: string]: any[] }; 
  availabilityPeriods: {
    startDate: string;
    endDate: string;
    activeDays: string[];
  }[];
  isFeatured: boolean;
  allowDeposit: boolean;
  depositPrice: number;
}

    