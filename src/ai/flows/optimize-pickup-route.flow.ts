'use server';
/**
 * @fileOverview A route optimization AI agent.
 *
 * - optimizePickupRoute - A function that handles the route optimization process.
 * - OptimizePickupRouteInput - The input type for the optimizePickupRoute function.
 * - OptimizePickupRouteOutput - The return type for the optimizePickupRoute function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizePickupRouteInputSchema = z.object({
  meetingPoints: z
    .array(
      z.object({
        name: z.string().describe('Name of the meeting point.'),
        latitude: z.number().describe('Latitude of the meeting point.'),
        longitude: z.number().describe('Longitude of the meeting point.'),
      })
    )
    .describe('An array of meeting points, including their names and coordinates.'),
});
export type OptimizePickupRouteInput = z.infer<typeof OptimizePickupRouteInputSchema>;

const OptimizePickupRouteOutputSchema = z.object({
  optimizedRoute: z
    .array(z.string())
    .describe('An array of meeting point names in the optimized order.'),
});
export type OptimizePickupRouteOutput = z.infer<typeof OptimizePickupRouteOutputSchema>;

const optimizePickupRouteFlow = ai.defineFlow(
  {
    name: 'optimizePickupRouteFlow',
    inputSchema: OptimizePickupRouteInputSchema,
    outputSchema: OptimizePickupRouteOutputSchema,
  },
  async input => {
    const prompt = `You are an expert route optimizer specializing in creating efficient routes for tour buses.

You will receive a list of meeting points, each with a name and coordinates.

Your goal is to determine the most efficient order to visit these meeting points to minimize travel time.

Consider factors such as distance between points.

Return an array of meeting point names in the optimized order.

Meeting Points:
{{#each meetingPoints}}
- Name: {{this.name}}, Latitude: {{this.latitude}}, Longitude: {{this.longitude}}
{{/each}}`;

    const {output} = await ai.generate({
      prompt: prompt,
      model: 'googleai/gemini-2.5-flash',
      input: input,
      output: {
        schema: OptimizePickupRouteOutputSchema,
      },
    });

    return output!;
  }
);


export async function optimizePickupRoute(
  input: OptimizePickupRouteInput
): Promise<{ data?: OptimizePickupRouteOutput; error?: string; }> {
  try {
    const output = await optimizePickupRouteFlow(input);
    return { data: output };
  } catch(e: any) {
    console.error('Error optimizing pickup route:', e);
    return { error: e.message || 'Failed to optimize pickup route.' };
  }
}
