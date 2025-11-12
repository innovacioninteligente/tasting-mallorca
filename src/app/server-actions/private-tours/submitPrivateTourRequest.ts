
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { z } from 'zod';
import { Resend } from 'resend';
import { getFirestore } from 'firebase-admin/firestore';
import { adminApp } from '@/firebase/server/config';

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

const resend = new Resend(process.env.RESEND_API_KEY);

export const submitPrivateTourRequest = createSafeAction(
  {}, // Public action
  async (data: FormValues): Promise<{ data?: { success: true }; error?: string }> => {
    try {
      const firestore = getFirestore(adminApp);
      const requestId = crypto.randomUUID();
      
      const requestData = {
        ...data,
        submittedAt: new Date(),
        preferredDate: data.preferredDate ? data.preferredDate.toISOString().split('T')[0] : null,
      };

      await firestore.collection('privateTourRequests').doc(requestId).set(requestData);

      // Send email notification
      await resend.emails.send({
        from: 'Tasting Mallorca <onboarding@resend.dev>',
        to: ['excursion.surprise@hotmail.com'],
        subject: `New Private Tour Request – ${data.name}`,
        html: `
          <h1>New Private Tour Request</h1>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
          <p><strong>Nationality:</strong> ${data.nationality || 'Not provided'}</p>
          <p><strong>Hotel:</strong> ${data.hotel}</p>
          <p><strong>Preferred Date:</strong> ${data.preferredDate ? data.preferredDate.toLocaleDateString() : 'Not specified'}</p>
          <p><strong>Participants:</strong> ${data.participants}</p>
          <p><strong>Preferred Language:</strong> ${data.preferredLanguage || 'Not specified'}</p>
          <p><strong>Visit Preferences:</strong></p>
          <ul>
            ${data.visitPreferences?.map(pref => `<li>${pref}</li>`).join('') || '<li>None specified</li>'}
          </ul>
          <p><strong>Additional Comments:</strong></p>
          <p>${data.additionalComments || 'None'}</p>
        `,
      });

      return { data: { success: true } };
    } catch (error: any) {
      console.error('Error submitting private tour request:', error);
      return { error: 'An unexpected error occurred. Please try again later.' };
    }
  }
);
