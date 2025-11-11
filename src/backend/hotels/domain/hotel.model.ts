
export type HotelRegion = 'North' | 'East' | 'South' | 'West' | 'Central';

export interface Hotel {
  id: string;
  name: string;
  address: string;
  region: HotelRegion;
  subRegion: string;
  latitude: number;
  longitude: number;
  assignedMeetingPointId?: string;
}

    