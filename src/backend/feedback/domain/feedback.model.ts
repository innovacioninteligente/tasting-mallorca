

import { z } from 'zod';

export interface GuestFeedback {
  id: string;
  name: string;
  nationality?: string;
  email?: string;
  phone?: string;
  tourDate: string; // Stored as YYYY-MM-DD
  rating: number;
  experience: string;
  photoUrl?: string;
  submittedAt: Date;
  published?: boolean;
  isFeatured?: boolean;
}

export const GuestFeedbackSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  nationality: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  tourDate: z.date({ required_error: "Tour date is required" }),
  rating: z.number().min(1).max(5),
  experience: z.string().min(1, "Experience is required"),
  photoUrl: z.any().optional(),
  published: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

export type GuestFeedbackFormValues = z.infer<typeof GuestFeedbackSchema>;
