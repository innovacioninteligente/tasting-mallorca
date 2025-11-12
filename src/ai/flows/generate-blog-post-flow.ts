
'use server';

import { z } from 'zod';

export const GenerateBlogPostInputSchema = z.object({
  prompt: z.string().describe('The user\'s idea or prompt for the blog post.'),
});
export type GenerateBlogPostInput = z.infer<typeof GenerateBlogPostInputSchema>;

const MultilingualStringSchema = z.object({
    en: z.string(),
    de: z.string(),
    fr: z.string(),
    nl: z.string(),
});

export const GenerateBlogPostOutputSchema = z.object({
  slug: MultilingualStringSchema,
  title: MultilingualStringSchema,
  summary: MultilingualStringSchema,
  content: MultilingualStringSchema,
});
export type GenerateBlogPostOutput = z.infer<typeof GenerateBlogPostOutputSchema>;


function buildPrompt(input: GenerateBlogPostInput): string {
    const outputSchemaForPrompt = {
        slug: { en: "string", de: "string", fr: "string", nl: "string" },
        title: { en: "string", de: "string", fr: "string", nl: "string" },
        summary: { en: "string", de: "string", fr: "string", nl: "string" },
        content: { en: "string", de: "string", fr: "string", nl: "string" },
    };

    return `You are an expert travel blogger and SEO specialist for "Tasting Mallorca", a company offering authentic food and culture tours in Mallorca. Your task is to write a complete, engaging, and SEO-optimized blog post based on the user's prompt, and then translate it into German (de), French (fr), and Dutch (nl).

    **CRITICAL INSTRUCTIONS:**
    1.  **Generate Original Content (English):** Based on the user's prompt, create the following in English:
        *   **Title:** An engaging, SEO-friendly title.
        *   **Summary:** A short, compelling summary (1-2 sentences) for blog post cards.
        *   **Content:** A full blog post of at least 400 words in Markdown format. Use headers (##), lists (*), and bold text to structure the content. Be creative, informative, and maintain a warm, inviting tone.
        *   **Slug:** A URL-friendly version of the English title (lowercase, hyphens for spaces, no special characters).

    2.  **Translate All Generated Content:** Translate the English title, slug, summary, and full Markdown content you created into German (de), French (fr), and Dutch (nl).
        *   **Cultural Nuances:** Do not perform a literal, word-for-word translation. Adapt the phrasing and tone to be natural and appealing for each target language.
        *   **Translate Slugs:** Ensure the slugs for each language are also URL-friendly versions of their respective translated titles.
        *   **Preserve Markdown:** You MUST preserve all Markdown syntax in the translated 'content' fields.

    3.  **Format your response STRICTLY as a single JSON object.** Do not wrap it in markdown backticks (\`\`\`json) or any other text. The JSON object must conform to the schema provided at the end of this prompt.

    **User's Blog Post Idea:**
    ---
    ${input.prompt}
    ---

    **Required Output JSON Schema:**
    \`\`\`json
    ${JSON.stringify(outputSchemaForPrompt, null, 2)}
    \`\`\`
    `;
}

async function getStreamingResponse(response: Response): Promise<string> {
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let result = '';
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        result += decoder.decode(value, { stream: true });
    }
    return result;
}


export async function generateBlogPost(input: GenerateBlogPostInput): Promise<GenerateBlogPostOutput> {
  const prompt = buildPrompt(input);
  
  const apiKey = process.env.VERTEX_AI_API_KEY;
  
  if (!apiKey) {
    throw new Error('VERTEX_AI_API_KEY environment variable is not set.');
  }

  const endpoint = `https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-lite:streamGenerateContent?key=${apiKey}`;

  let rawResponseText = '';

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

    rawResponseText = await getStreamingResponse(response);

    if (!rawResponseText) {
        throw new Error('No response text from AI model.');
    }
    
    // Combine chunks if the response is streamed and comes in a JSON array format
    let combinedText = rawResponseText;
    try {
        const chunks = JSON.parse(rawResponseText);
        if (Array.isArray(chunks)) {
            combinedText = chunks.map((chunk: any) => chunk.candidates[0].content.parts[0].text).join('');
        }
    } catch (e) {
        // If parsing as array fails, assume it's a single JSON object string
    }

    // Clean the response: remove markdown and extract JSON
    const jsonMatch = combinedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error(`AI returned invalid JSON format. Raw response: ${combinedText}`);
    }
    const jsonString = jsonMatch[0];

    const parsedJson = JSON.parse(jsonString);
    return GenerateBlogPostOutputSchema.parse(parsedJson);

  } catch (error: any) {
    console.error("[Vertex AI Error] Failed to generate content:", error);
    if (error instanceof z.ZodError) {
        const detailedError = `The AI's response did not match the expected format. Details: ${JSON.stringify(error.issues, null, 2)}. Raw AI Response: ${rawResponseText}`;
        throw new Error(detailedError);
    }
    if (error.message.includes("invalid JSON")) {
        throw new Error(`Vertex AI API call failed: AI returned invalid JSON format. Raw response: ${rawResponseText}`);
    }
    throw new Error(`Vertex AI API call failed: ${error.message}`);
  }
}