
export type MeetingPointRegion = 'North' | 'East' | 'South' | 'West' | 'Central';

export interface MeetingPoint {
  id: string;
  name: string;
  address: string;
  region: MeetingPointRegion;
  googleMapsUrl: string;
  latitude: number;
  longitude: number;
}

    