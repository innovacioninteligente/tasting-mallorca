
import { GoogleGenAI } from '@google/genai';

const project = process.env.GOOGLE_CLOUD_PROJECT;
const location = process.env.GOOGLE_CLOUD_LOCATION;

if (!project || !location) {
    throw new Error('Google Cloud project and location must be set in environment variables.');
}

export const vertexAI = new GoogleGenAI({
    vertexai: true,
    project,
    location,
});
