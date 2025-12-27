
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import * as dotenv from 'dotenv';
import path from 'path';
import { assignMeetingPointToHotels } from '@/backend/hotels/application/assignMeetingPointToHotels';
import { FirestoreHotelRepository } from '@/backend/hotels/infrastructure/firestore-hotel.repository';
import { FirestoreMeetingPointRepository } from '@/backend/meeting-points/infrastructure/firestore-meeting-point.repository';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount),
    });
}

async function runMigration() {
    console.log('Starting migration...');
    try {
        const hotelRepo = new FirestoreHotelRepository();
        const mpRepo = new FirestoreMeetingPointRepository();

        const result = await assignMeetingPointToHotels(hotelRepo, mpRepo);

        if (result.success) {
            console.log(`Migration successful! Updated ${result.updatedCount} hotels.`);
        } else {
            console.error(`Migration failed: ${result.error}`);
        }
    } catch (error: any) {
        console.error('Migration error:', error);
    }
}

runMigration();
