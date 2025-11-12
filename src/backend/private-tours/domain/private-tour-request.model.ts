export interface PrivateTourRequest {
    id: string;
    name: string;
    email: string;
    phone?: string;
    nationality?: string;
    hotel: string;
    preferredDate?: string | null;
    participants: number;
    preferredLanguage?: string;
    visitPreferences?: string[];
    additionalComments?: string;
    submittedAt: Date;
}
