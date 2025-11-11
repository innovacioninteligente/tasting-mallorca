
'use server';

async function getFinalUrl(url: string): Promise<string> {
    try {
        const response = await fetch(url, { 
            method: 'GET',
            redirect: 'follow', // Default behavior, but explicit
            headers: {
                 // Mimic a browser user-agent to ensure Google serves the redirecting page
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        return response.url;
    } catch (error) {
        console.error(`Could not resolve URL ${url}. Error: ${(error as Error).message}`);
        // If fetch fails, return the original URL and hope for the best
        return url;
    }
}


export async function getCoordsFromUrl(url: string): Promise<{ latitude: number, longitude: number }> {
    try {
        const finalUrl = await getFinalUrl(url);

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
