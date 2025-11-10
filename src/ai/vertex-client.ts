
import { GoogleGenAI } from '@google/genai';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '@/firebase/server/config';

const project = process.env.GOOGLE_CLOUD_PROJECT;
const location = process.env.GOOGLE_CLOUD_LOCATION;

if (!project || !location) {
    throw new Error('Google Cloud project and location must be set in environment variables.');
}

// Ensure admin app is initialized
adminApp;

async function getAuthenticatedClient(): Promise<GoogleGenAI> {
  try {
    const auth = getAuth();
    const accessToken = await auth.getAccessToken();

    return new GoogleGenAI({
      vertexai: true,
      project,
      location,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });
  } catch (error) {
    console.error('Error getting access token for Vertex AI:', error);
    throw new Error('Failed to create authenticated Vertex AI client.');
  }
}


class VertexAIClient {
    private client: GoogleGenAI | null = null;
    private clientPromise: Promise<GoogleGenAI> | null = null;

    private async initializeClient(): Promise<GoogleGenAI> {
        if (this.client) {
            return this.client;
        }
        if (this.clientPromise) {
            return this.clientPromise;
        }
        
        this.clientPromise = getAuthenticatedClient();
        
        try {
            this.client = await this.clientPromise;
            return this.client;
        } finally {
            this.clientPromise = null;
        }
    }
    
    public async getModels() {
        const client = await this.initializeClient();
        return client.models;
    }
}

export const vertexAI = new VertexAIClient();
