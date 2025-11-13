'use server';

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/dictionaries/get-dictionary';
import { Locale } from '@/dictionaries/config';
import { findBookingById } from '@/app/server-actions/bookings/findBooking';
import { BookingDetailsClientPage } from './booking-details-client-page';


export default async function BookingDetailsPage({ params }: { params: { lang: Locale, bookingId: string } }) {
    const { lang, bookingId } = params;

    // This is a server component, so we can fetch data directly.
    // The "verifyBookingAction" will have redirected here, so we assume the user is authorized for this specific booking.
    // For extra security, a temporary token could be passed and verified.
    const result = await findBookingById(bookingId);

    if (!result.data) {
        notFound();
    }
    
    return (
        <Suspense fallback={<div>Loading booking details...</div>}>
            <BookingDetailsClientPage booking={result.data} lang={lang} />
        </Suspense>
    );
}
