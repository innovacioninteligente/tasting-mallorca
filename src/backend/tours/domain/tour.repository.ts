import { Tour } from './tour.model';

export interface TourRepository {
  findById(id: string): Promise<Tour | null>;
  findAll(): Promise<Tour[]>;
  save(tour: Tour): Promise<void>;
  update(tour: Partial<Tour> & { id: string }): Promise<void>;
}
