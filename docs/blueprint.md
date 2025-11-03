# **App Name**: Tasting Mallorca Tours

## Core Features:

- Tour Listing & Filtering: Display tours with interactive map integration, filtering by hotel/meeting point. Big & Clear design focused on UX for senior users.
- Multilingual Support: Modular translation system supporting 6 languages (EN/ES/CA/FR/DE/NL) with intelligent fallback and SEO optimization using Hreflang tags and dynamic metadata.
- Simplified Booking Flow: Streamlined booking process (Tour -> Date/Language -> Payment) with a clear and large component for easy input, focusing on minimal required fields.
- Meeting Point Geocoding: System to calculate the closest meeting point based on the user's hotel, displayed on a map with estimated pickup time.
- QR Code Ticket Generation: Generate a unique, single-use QR code per passenger/booking that is invalidated upon scanning or after tour time using Cloud Functions.
- Route Optimization Tool: AI-powered tool to calculate the most efficient pickup route for the day's tour, ordering meeting points to minimize travel time.
- Admin Dashboard: Secure admin interface with Firebase Authentication and Admin SDK, providing tour, pricing, scheduling, and content management across 6 languages.
- Firestore integration: Data persistence via Firestore

## Style Guidelines:

- Primary color: A warm, inviting saffron (#FFB833) to evoke the vibrant culture of Mallorca and the authentic tasting experiences.
- Background color: A desaturated sand beige (#F2E9D4), lending an organic, earthy feel, offering high contrast to text and colorful imagery.
- Accent color: A rich terracotta (#C25E31) suggesting the sun-baked earth of Mallorca, employed to draw attention to calls to action and important UI elements.
- Headline font: 'Belleza', a humanist sans-serif, is recommended for headlines to bring an artful, fashionable, and approachable feel to the site
- Body font: 'Alegreya', a humanist serif, will complement the 'Belleza' headlines with a touch of elegance and contemporary refinement needed for readability
- Use clear, descriptive icons to represent tour types, meeting points, and languages. Icons should be large and easily recognizable to accommodate senior users.
- Implement a clear, spacious layout with high contrast. Prioritize a simple and intuitive navigation that's easy for senior users to understand and use.
- Use subtle, non-distracting animations to enhance user experience. For example, use smooth transitions for page loads and tour details.