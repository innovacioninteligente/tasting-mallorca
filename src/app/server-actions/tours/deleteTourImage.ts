
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { z } from 'zod';
import { FirestoreTourRepository } from '@/backend/tours/infrastructure/firestore-tour.repository';
import { getStorage } from 'firebase-admin/storage';
import { adminApp } from '@/firebase/server/config';
import { firestore } from 'firebase-admin';

adminApp;

const deleteTourImageSchema = z.object({
  tourId: z.string(),
  imageUrl: z.string().url(),
});

function getFilePathFromUrl(url: string): string | null {
    try {
        const urlObject = new URL(url);
        // Pathname for firebase storage is /v0/b/bucket-name/o/path%2Fto%2Ffile
        const pathSegments = urlObject.pathname.split('/o/');
        if (pathSegments.length < 2) return null;

        return decodeURIComponent(pathSegments[1]);
    } catch (error) {
        console.error(`Invalid URL provided, cannot extract file path: ${url}`, error);
        return null;
    }
}

export const deleteTourImage = createSafeAction(
  {
    allowedRoles: ['admin'],
    inputSchema: deleteTourImageSchema,
  },
  async ({ tourId, imageUrl }): Promise<{ data?: { success: boolean }; error?: string }> => {
    try {
      const tourRepository = new FirestoreTourRepository();
      const tour = await tourRepository.findById(tourId);

      if (!tour) {
        return { error: 'Tour not found.' };
      }

      // 1. Delete from Firebase Storage
      const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
      if (!bucketName) {
        throw new Error('Firebase Storage bucket name is not configured.');
      }
      const bucket = getStorage().bucket(bucketName);
      const filePath = getFilePathFromUrl(imageUrl);
      
      if (filePath) {
          const file = bucket.file(filePath);
          await file.delete().catch(err => console.warn(`Could not delete file ${filePath}: ${err.message}`));
      }

      // 2. Update Firestore document
      if (tour.mainImage === imageUrl) {
        await tourRepository.update({ id: tourId, mainImage: '' }); // Or set to a placeholder
      } else {
        await tourRepository.update({ 
            id: tourId, 
            galleryImages: firestore.FieldValue.arrayRemove(imageUrl) as any
        });
      }

      return { data: { success: true } };
    } catch (error: any) {
      console.error('Error deleting tour image:', error);
      return { error: error.message || 'Failed to delete tour image.' };
    }
  }
);

    