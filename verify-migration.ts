
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import * as dotenv from 'dotenv';
import path from 'path';
import { FirestoreHotelRepository } from '@/backend/hotels/infrastructure/firestore-hotel.repository';

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

async function verify() {
    console.log('Verifying migration...');
    const hotelRepo = new FirestoreHotelRepository();
    const hotels = await hotelRepo.findAll();

    if (hotels.length > 0) {
        const hotel = hotels[0];
        console.log(`Checking Hotel: ${hotel.name} (${hotel.id})`);
        console.log('assignedMeetingPoints:', JSON.stringify(hotel.assignedMeetingPoints, null, 2));
        console.log('assignedMeetingPointId (legacy):', hotel.assignedMeetingPointId);
    } else {
        console.log('No hotels found.');
    }
}

verify();
