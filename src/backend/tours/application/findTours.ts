import { Tour } from '../domain/tour.model';
import { TourRepository } from '../domain/tour.repository';

export async function findTourById(
  tourRepository: TourRepository,
  id: string
): Promise<Tour | null> {
  return tourRepository.findById(id);
}

export async function findAllTours(
  tourRepository: TourRepository
): Promise<Tour[]> {
  return tourRepository.findAll();
}
