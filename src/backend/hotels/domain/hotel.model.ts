
export type HotelRegion = 'North' | 'East' | 'South' | 'West' | 'Central';

export interface Hotel {
  id: string;
  name: string;
  address: string | null;
  region: HotelRegion;
  subRegion: string;
  latitude: number;
  longitude: number;
  assignedMeetingPointId?: string | null; // @deprecated Use assignedMeetingPoints instead
  assignedMeetingPoints?: { [key: string]: string }; // key is the Region (North, South, etc.)
}
