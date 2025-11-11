
import { Hotel } from './hotel.model';

export interface HotelRepository {
  findById(id: string): Promise<Hotel | null>;
  findAll(): Promise<Hotel[]>;
  save(hotel: Hotel): Promise<void>;
  update(hotel: Partial<Hotel> & { id: string }): Promise<void>;
  delete(id: string): Promise<void>;
}

    