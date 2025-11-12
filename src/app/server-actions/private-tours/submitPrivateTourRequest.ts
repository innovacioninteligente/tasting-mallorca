'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { z } from 'zod';
import { FirestorePrivateTourRequestRepository } from '@/backend/private-tours/infrastructure/firestore-private-tour-request.repository';
import { createPrivateTourRequest } from '@/backend/private-tours/application/createPrivateTourRequest';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  phone: z.string().optional(),
  nationality: z.string().optional(),
  hotel: z.string().min(1, 'Hotel is required'),
  preferredDate: z.date().optional(),
  participants: z.coerce.number().min(1),
  preferredLanguage: z.string().optional(),
  visitPreferences: z.array(z.string()).optional(),
  additionalComments: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const submitPrivateTourRequest = createSafeAction(
  {}, // Public action
  async (data: FormValues): Promise<{ data?: { success: true }; error?: string }> => {
    try {
      const repository = new FirestorePrivateTourRequestRepository();
      
      const requestData = {
        id: crypto.randomUUID(),
        ...data,
        submittedAt: new Date(),
        preferredDate: data.preferredDate ? data.preferredDate.toISOString().split('T')[0] : null,
      };

      await createPrivateTourRequest(repository, requestData);

      // Email functionality has been removed as requested.
      // It will be handled by a Firebase Trigger later.

      return { data: { success: true } };
    } catch (error: any) {
      console.error('Error submitting private tour request:', error);
      return { error: 'An unexpected error occurred. Please try again later.' };
    }
  }
);
