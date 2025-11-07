
'use server';

import { getStorage } from 'firebase-admin/storage';
import { createSafeAction } from '../lib/safe-action';
import { adminApp } from '@/firebase/server/config';

// Initialize Firebase Admin SDK
adminApp;

async function uploadFile(file: File, tourId: string): Promise<string> {
    const storage = getStorage();
    const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);
    
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = `tours/${tourId}/${Date.now()}-${file.name}`;
    const fileUpload = bucket.file(fileName);

    await fileUpload.save(fileBuffer, {
        metadata: {
            contentType: file.type,
        },
    });

    // Make the file public and get its URL
    await fileUpload.makePublic();
    return fileUpload.publicUrl();
}


export const uploadImages = createSafeAction(
  {
    allowedRoles: ['admin'],
  },
  async (
    formData: FormData,
    context
  ): Promise<{ data?: { mainImageUrl: string, galleryImageUrls: string[] }; error?: string }> => {
    try {
        const tourId = crypto.randomUUID(); // Generate a unique ID for the new tour folder

        const mainImageFile = formData.get('mainImage') as File | null;
        const galleryImageFiles = formData.getAll('galleryImages') as File[];

        if (!mainImageFile) {
            return { error: 'Main image is required.' };
        }

        if (galleryImageFiles.length === 0) {
            return { error: 'At least one gallery image is required.'}
        }
        
        // Upload main image
        const mainImageUrl = await uploadFile(mainImageFile, tourId);
        
        // Upload gallery images in parallel
        const galleryImageUrls = await Promise.all(
            galleryImageFiles.map(file => uploadFile(file, tourId))
        );

        return { data: { mainImageUrl, galleryImageUrls } };

    } catch (error: any) {
        console.error('Error uploading images:', error);
        return { error: error.message || 'Failed to upload images.' };
    }
  }
);

    