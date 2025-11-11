
'use server';

async function followRedirects(url: string): Promise<string> {
    const response = await fetch(url, { method: 'HEAD', redirect: 'manual' });
    if (response.status >= 300 && response.status < 400 && response.headers.has('location')) {
        // Handle relative redirects
        const location = response.headers.get('location')!;
        const nextUrl = new URL(location, url);
        return nextUrl.href;
    }
    return url;
}

export async function getCoordsFromUrl(url: string): Promise<{ latitude: number, longitude: number }> {
    try {
        const finalUrl = await followRedirects(url);

        const match = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (match && match[1] && match[2]) {
            const latitude = parseFloat(match[1]);
            const longitude = parseFloat(match[2]);
            return { latitude, longitude };
        }

        throw new Error('Could not extract coordinates from the Google Maps URL.');

    } catch(error: any) {
        console.error("Failed to get coordinates from URL:", error);
        throw new Error(`Could not process Google Maps URL. Please check if the link is valid. Error: ${error.message}`);
    }
}

    