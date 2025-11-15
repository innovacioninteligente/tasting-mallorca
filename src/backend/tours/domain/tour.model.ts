

import { z } from 'zod';

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

// Zod schema for input validation in server actions
const multilingualStringSchema = z.object({
    en: z.string().min(1, { message: "El texto en inglés es requerido." }),
    de: z.string().optional(),
    fr: z.string().optional(),
    nl: z.string().optional(),
});

const multilingualOptionalStringSchema = z.object({
    en: z.string().optional(),
    de: z.string().optional(),
    fr: z.string().optional(),
    nl: z.string().optional(),
}).optional();

const availabilityPeriodSchema = z.object({
    startDate: z.date({ required_error: "Start date is required." }),
    endDate: z.date({ required_error: "End date is required." }),
    activeDays: z.array(z.string()).min(1, "At least one active day is required."),
});

const pickupPointSchema = z.object({
    title: multilingualStringSchema,
    description: multilingualStringSchema,
});

const detailsSchema = z.object({
    highlights: multilingualOptionalStringSchema,
    fullDescription: multilingualOptionalStringSchema,
    included: multilingualOptionalStringSchema,
    notIncluded: multilingualOptionalStringSchema,
    notSuitableFor: multilingualOptionalStringSchema,
    whatToBring: multilingualOptionalStringSchema,
    beforeYouGo: multilingualOptionalStringSchema,
}).optional();

const itineraryItemSchema = z.object({
    id: z.string(),
    type: z.enum(["stop", "travel"]),
    icon: z.string(),
    duration: z.string().min(1, "La duración es requerida."),
    title: multilingualStringSchema,
    activities: z.object({
        en: z.array(z.string()).optional(),
        de: z.array(z.string()).optional(),
        fr: z.array(z.string()).optional(),
        nl: z.array(z.string()).optional(),
    }),
});

// This type is used by the form, which can handle Files and Dates.
// The server actions will have their own schemas for serialized data.
export const CreateTourInputSchema = z.object({
  id: z.string().optional(),
  title: multilingualStringSchema,
  slug: multilingualStringSchema,
  description: multilingualStringSchema,
  overview: multilingualStringSchema,
  generalInfo: z.object({
    cancellationPolicy: multilingualStringSchema,
    bookingPolicy: multilingualStringSchema,
    guideInfo: multilingualStringSchema,
    pickupInfo: multilingualStringSchema,
  }),
  details: detailsSchema,
  pickupPoint: pickupPointSchema,
  price: z.coerce.number().min(0, "El precio debe ser un número positivo."),
  childPrice: z.coerce.number().optional(),
  region: z.enum(["North", "East", "South", "West", "Central"]),
  durationHours: z.coerce.number().min(1, "La duración debe ser al menos 1 hora."),
  isFeatured: z.boolean().default(false),
  published: z.boolean().default(false),
  mainImage: z.any().refine(val => val, "La imagen principal es requerida."),
  galleryImages: z.any().optional(),
  allowDeposit: z.boolean().default(false),
  depositPrice: z.coerce.number().optional(),
  availabilityPeriods: z.array(availabilityPeriodSchema).optional(),
  itinerary: z.array(itineraryItemSchema).optional(),
}).refine(data => {
    if (data.allowDeposit) {
        return data.depositPrice !== undefined && data.depositPrice > 0;
    }
    return true;
}, {
    message: "El precio del depósito es requerido si se permiten depósitos.",
    path: ["depositPrice"],
}).refine(data => {
    if (data.allowDeposit && data.depositPrice) {
        return data.depositPrice < data.price;
    }
    return true;
}, {
    message: "El depósito no puede ser mayor o igual al precio total.",
    path: ["depositPrice"],
});

export type CreateTourInput = z.infer<typeof CreateTourInputSchema>;
