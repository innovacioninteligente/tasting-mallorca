'use server';

import { Content, CustomData, EventRequest, UserData, ServerEvent } from 'facebook-nodejs-business-sdk';
import { headers } from 'next/headers';

const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
const ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;

/**
 * Sends an event to Meta Conversions API.
 */
export async function sendMetaEvent(
    eventName: string,
    eventId: string,
    user: {
        email?: string; // Should be plain text, SDK handles hashing
        phone?: string; // Should be plain text, SDK handles hashing
        fbp?: string;
        fbc?: string;
    },
    customData?: {
        value?: number;
        currency?: string;
        content_name?: string;
        content_ids?: string[];
        content_type?: string;
    },
    url?: string
) {
    if (!PIXEL_ID || !ACCESS_TOKEN) {
        console.warn('Meta CAPI: Missing credentials (PIXEL_ID or ACCESS_TOKEN).');
        return { success: false, error: 'Missing credentials' };
    }

    try {
        const headersList = await headers();
        const clientIp = headersList.get('x-forwarded-for')?.split(',')[0] || '0.0.0.0';
        const userAgent = headersList.get('user-agent') || '';

        const userData = new UserData()
            .setClientIpAddress(clientIp)
            .setClientUserAgent(userAgent);

        if (user.email) userData.setEmail(user.email);
        if (user.phone) userData.setPhone(user.phone);
        if (user.fbp) userData.setFbp(user.fbp);
        if (user.fbc) userData.setFbc(user.fbc);

        const content = new Content();
        // basic mapping if needed, or stick to CustomData

        const customDataObj = new CustomData();
        if (customData?.value) customDataObj.setValue(customData.value);
        if (customData?.currency) customDataObj.setCurrency(customData.currency);
        if (customData?.content_name) customDataObj.setContentName(customData.content_name);
        if (customData?.content_ids) customDataObj.setContentIds(customData.content_ids);
        if (customData?.content_type) customDataObj.setContentType(customData.content_type);

        const event = new ServerEvent()
            .setEventName(eventName)
            .setEventTime(Math.floor(Date.now() / 1000))
            .setUserData(userData)
            .setCustomData(customDataObj)
            .setEventSourceUrl(url || 'https://tastingmallorca.com')
            .setActionSource('website')
            .setEventId(eventId);

        const request = new EventRequest(ACCESS_TOKEN, PIXEL_ID).setEvents([event]);

        const response = await request.execute();

        // console.log(`Meta CAPI (${eventName}) sent:`, response);
        return { success: true };

    } catch (error: any) {
        console.error(`Meta CAPI Error (${eventName}):`, error.response || error);
        return { success: false, error: error.message };
    }
}
