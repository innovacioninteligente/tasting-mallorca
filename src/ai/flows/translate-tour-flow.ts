'use server';

import { z } from 'zod';

const ItineraryItemTranslationInputSchema = z.object({
  title: z.string().optional(),
  activities: z.array(z.string()).optional(),
});

export const TranslateTourInputSchema = z.object({
  title: z.string().describe('The title of the tour in English.'),
  description: z.string().describe('The short description of the tour in English.'),
  overview: z.string().describe('The detailed overview of the tour in English.'),
  generalInfo: z.object({
    cancellationPolicy: z.string().describe('Cancellation policy text in English.'),
    bookingPolicy: z.string().describe('Booking policy text in English.'),
    guideInfo: z.string().describe('Guide information text in English.'),
    pickupInfo: z.string().describe('Pickup information text in English.'),
  }),
  details: z.object({
      highlights: z.string().describe('List of highlights, separated by newlines.'),
      fullDescription: z.string().describe('The full, detailed description.'),
      included: z.string().describe('List of what is included, separated by newlines.'),
      notIncluded: z.string().describe('List of what is not included, separated by newlines.'),
      notSuitableFor: z.string().describe('List of who this is not suitable for, separated by newlines.'),
      whatToBring: z.string().describe('List of what to bring, separated by newlines.'),
      beforeYouGo: z.string().describe('List of things to know before you go, separated by newlines.'),
  }),
  pickupPoint: z.object({
    title: z.string().describe('Pickup point main title in English.'),
    description: z.string().describe('Pickup point detailed description in English.'),
  }),
  itinerary: z.array(ItineraryItemTranslationInputSchema).describe('An array of itinerary items in English.'),
});
export type TranslateTourInput = z.infer<typeof TranslateTourInputSchema>;

const MultilingualStringSchema = z.object({
    es: z.string().optional(),
    de: z.string().optional(),
    fr: z.string().optional(),
    nl: z.string().optional(),
});

const ItineraryItemTranslationOutputSchema = z.object({
    title: MultilingualStringSchema.optional(),
    activities: z.object({
        es: z.array(z.string()).optional(),
        de: z.array(z.string()).optional(),
        fr: z.array(z.string()).optional(),
        nl: z.array(z.string()).optional(),
    }).optional(),
});

export const TranslateTourOutputSchema = z.object({
  title: MultilingualStringSchema,
  description: MultilingualStringSchema,
  overview: MultilingualStringSchema,
  generalInfo: z.object({
    cancellationPolicy: MultilingualStringSchema,
    bookingPolicy: MultilingualStringSchema,
    guideInfo: MultilingualStringSchema,
    pickupInfo: MultilingualStringSchema,
  }),
  details: z.object({
    highlights: MultilingualStringSchema,
    fullDescription: MultilingualStringSchema,
    included: MultilingualStringSchema,
    notIncluded: MultilingualStringSchema,
    notSuitableFor: MultilingualStringSchema,
    whatToBring: MultilingualStringSchema,
    beforeYouGo: MultilingualStringSchema,
  }),
  pickupPoint: z.object({
    title: MultilingualStringSchema,
    description: MultilingualStringSchema,
  }),
  itinerary: z.array(ItineraryItemTranslationOutputSchema),
});
export type TranslateTourOutput = z.infer<typeof TranslateTourOutputSchema>;

function buildPrompt(input: TranslateTourInput): string {
    return `You are an expert translator specializing in creating engaging and natural-sounding tourism marketing content for a European audience. Your task is to translate the provided tour information from English into Spanish (es), German (de), French (fr), and Dutch (nl).

    **IMPORTANT INSTRUCTIONS:**
    1.  **Do not perform a literal, word-for-word translation.** Adapt the phrasing, tone, and cultural nuances to make the content appealing and natural for speakers of each target language.
    2.  **Maintain the original meaning and key information.** The core details of the tour must remain accurate.
    3.  **Translate list items individually.** For fields that are newline-separated lists (like highlights, included, etc.), translate each line as a separate item and maintain the newline-separated format in your output.
    4.  **Format your response strictly as a JSON object** that conforms to the provided output schema. Do not wrap it in markdown backticks or any other text.
    5.  For itinerary activities, translate each tag individually.
    6.  If a source field is empty, the corresponding translated fields should also be empty strings.

    **Source Content (English):**
    - Title: ${input.title}
    - Description: ${input.description}
    - Overview: ${input.overview}
    - General Info:
      - Cancellation Policy: ${input.generalInfo.cancellationPolicy}
      - Booking Policy: ${input.generalInfo.bookingPolicy}
      - Guide Info: ${input.generalInfo.guideInfo}
      - Pickup Info: ${input.generalInfo.pickupInfo}
    - Details:
      - Highlights: ${input.details?.highlights}
      - Full Description: ${input.details?.fullDescription}
      - Included: ${input.details?.included}
      - Not Included: ${input.details?.notIncluded}
      - Not Suitable For: ${input.details?.notSuitableFor}
      - What To Bring: ${input.details?.whatToBring}
      - Before You Go: ${input.details?.beforeYouGo}
    - Pickup Point:
      - Title: ${input.pickupPoint.title}
      - Description: ${input.pickupPoint.description}
    - Itinerary Items:
    ${input.itinerary?.map((item, index) => `
      - Item ${index}:
        - Title: ${item.title}
        - Activities: ${item.activities?.join(', ')}
    `).join('')}

    **Output JSON Schema:**
    ${JSON.stringify(TranslateTourOutputSchema.shape, null, 2)}
    `;
}

export async function translateTour(input: TranslateTourInput): Promise<TranslateTourOutput> {
  const prompt = buildPrompt(input);
  
  const apiKey = process.env.VERTEX_AI_API_KEY;
  
  if (!apiKey) {
    throw new Error('VERTEX_AI_API_KEY environment variable is not set.');
  }

  // This is the global endpoint, not tied to a specific project or location.
  const endpoint = `https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-lite:streamGenerateContent?key=${apiKey}`;

  console.log("Sending translation request to Vertex AI REST API...");
  console.log("Prompt:", prompt.substring(0, 500) + "..."); // Log first 500 chars

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
        }
      })
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Vertex AI API Error Body:", errorBody);
        throw new Error(`Vertex AI API call failed with status ${response.status}: ${response.statusText}`);
    }

    const responseText = await response.text();
    // The response is a stream of JSON objects. We need to parse them.
    // It's typically an array of chunks, let's combine them.
    // Example: '[{"candidates":...}]' or multiple JSON objects in a stream
    // A simple approach is to remove brackets and join.
    const combinedJsonText = responseText.replace(/\]\[/g, ',').slice(1, -1);

    if (!combinedJsonText) {
        throw new Error('No response text from AI model.');
    }
        
    try {
        // Since it's a stream, we might get multiple JSON objects. We'll parse the first one that has the content.
        const streamData = JSON.parse(combinedJsonText);
        const contentText = streamData.candidates[0].content.parts[0].text;
        const parsedJson = JSON.parse(contentText);
        return TranslateTourOutputSchema.parse(parsedJson);
    } catch (e) {
        console.error("Failed to parse AI response:", e);
        console.error("Raw AI response:", combinedJsonText);
        throw new Error("AI returned invalid JSON format.");
    }
  } catch (error: any) {
    console.error("[Vertex AI Error] Failed to generate content:", error);
    throw new Error(`Vertex AI API call failed: ${error.message}`);
  }
}
