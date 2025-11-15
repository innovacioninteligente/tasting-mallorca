
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { createTour as createTourUseCase } from '@/backend/tours/application/createTour';
import { FirestoreTourRepository } from '@/backend/tours/infrastructure/firestore-tour.repository';
import { Tour, type CreateTourInput } from '@/backend/tours/domain/tour.model';
import { z } from 'zod';

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

const actionInputSchema = z.object({
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
  availabilityPeriods: z.array(z.object({
    startDate: z.string(),
    endDate: z.string(),
    activeDays: z.array(z.string()),
  })).optional(),
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

export const createTour = createSafeAction(
  {
    allowedRoles: ['admin'],
    inputSchema: actionInputSchema,
  },
  async (
    tourData: any
  ): Promise<{ data?: { tourId: string }; error?: string }> => {
    try {
      const tourRepository = new FirestoreTourRepository();
      
      const newTour: Tour = {
        ...tourData,
        price: Number(tourData.price),
        childPrice: tourData.childPrice ? Number(tourData.childPrice) : 0,
        durationHours: Number(tourData.durationHours),
        depositPrice: tourData.allowDeposit ? Number(tourData.depositPrice) : 0,
        itinerary: tourData.itinerary || [],
        availabilityPeriods: tourData.availabilityPeriods || [],
        galleryImages: tourData.galleryImages || [],
      };

      await createTourUseCase(tourRepository, newTour);

      return { data: { tourId: newTour.id } };
    } catch (error: any) {
      console.error('Error creating tour:', error);
      return { error: error.message || 'Failed to create tour.' };
    }
  }
);
