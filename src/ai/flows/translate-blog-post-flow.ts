

import { z } from 'zod';

export const TranslateBlogPostInputSchema = z.object({
  title: z.string().describe('The title of the blog post in English.'),
  slug: z.string().describe('The URL-friendly slug in English.'),
  summary: z.string().describe('The short summary of the post in English.'),
  content: z.string().describe('The full content of the post in Markdown format, in English.'),
});
export type TranslateBlogPostInput = z.infer<typeof TranslateBlogPostInputSchema>;

const MultilingualStringSchema = z.object({
    de: z.string().optional(),
    fr: z.string().optional(),
    nl: z.string().optional(),
});

export const TranslateBlogPostOutputSchema = z.object({
  slug: MultilingualStringSchema,
  title: MultilingualStringSchema,
  summary: MultilingualStringSchema,
  content: MultilingualStringSchema,
});
export type TranslateBlogPostOutput = z.infer<typeof TranslateBlogPostOutputSchema>;

function buildPrompt(input: TranslateBlogPostInput): string {
    const outputSchemaForPrompt = {
        slug: { de: "string", fr: "string", nl: "string" },
        title: { de: "string", fr: "string", nl: "string" },
        summary: { de: "string", fr: "string", nl: "string" },
        content: { de: "string", fr: "string", nl: "string" },
    };

    return `You are an expert translator specializing in creating engaging and natural-sounding blog content for a European audience. Your task is to translate the provided blog post from English into German (de), French (fr), and Dutch (nl).

    **CRITICAL INSTRUCTIONS:**
    1.  **Do not perform a literal, word-for-word translation.** Adapt the phrasing, tone, and cultural nuances to make the content appealing and natural for speakers of each target language.
    2.  **Translate the 'slug' field.** It must be a URL-friendly version of the translated title (lowercase, hyphens for spaces, no special characters).
    3.  **Preserve Markdown Formatting:** The 'content' field is in Markdown. You MUST preserve all Markdown syntax (like ## for headers, * for lists, etc.) in your translated output.
    4.  **Format your response STRICTLY as a JSON object.** Do not wrap it in markdown backticks (\`\`\`json) or any other text.

    **Source Content (English):**
    - Title: ${input.title}
    - Slug: ${input.slug}
    - Summary: ${input.summary}
    - Content (Markdown):
    ---
    ${input.content}
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


export async function translateBlogPost(input: TranslateBlogPostInput): Promise<TranslateBlogPostOutput> {
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

    return TranslateBlogPostOutputSchema.parse(parsedJson);

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
