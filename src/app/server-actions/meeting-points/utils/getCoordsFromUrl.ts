
'use server';

async function followRedirects(url: string): Promise<string> {
    try {
        const response = await fetch(url, { method: 'HEAD', redirect: 'manual' });
        if (response.status >= 300 && response.status < 400 && response.headers.has('location')) {
            const location = response.headers.get('location')!;
            // Recursively follow redirects, but with a limit to prevent infinite loops
            return followRedirects(new URL(location, url).href);
        }
        return url;
    } catch (error) {
        // If HEAD request fails (e.g. CORS or network issue), just return the original URL
        console.warn(`Could not follow redirect for ${url}, proceeding with original URL. Error: ${(error as Error).message}`);
        return url;
    }
}

export async function getCoordsFromUrl(url: string): Promise<{ latitude: number, longitude: number }> {
    try {
        const finalUrl = await followRedirects(url);

        // Regex patterns to try
        const patterns = [
            /@(-?\d+\.\d+),(-?\d+\.\d+)/,      // For URLs like .../@39.5696,2.6502...
            /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/   // For URLs like ...!3d39.5696!4d2.6502...
        ];

        for (const pattern of patterns) {
            const match = finalUrl.match(pattern);
            if (match && match[1] && match[2]) {
                const latIndex = pattern.source.includes('!3d') ? 1 : 1;
                const lonIndex = pattern.source.includes('!4d') ? 2 : 2;
                return { 
                    latitude: parseFloat(match[latIndex]), 
                    longitude: parseFloat(match[lonIndex]) 
                };
            }
        }
        
        // Fallback: Try to parse from URL search parameters (e.g. ?ll=39.5,-2.6)
        const urlObject = new URL(finalUrl);
        const llParam = urlObject.searchParams.get('ll');
        if (llParam) {
            const [lat, lon] = llParam.split(',');
            if (lat && lon) {
                return {
                    latitude: parseFloat(lat),
                    longitude: parseFloat(lon)
                };
            }
        }


        throw new Error('Could not extract coordinates from the Google Maps URL.');

    } catch(error: any) {
        console.error("Failed to get coordinates from URL:", error);
        throw new Error(`Could not process Google Maps URL. Please check if the link is valid. Error: ${error.message}`);
    }
}
