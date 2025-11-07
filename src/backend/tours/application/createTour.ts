
import { Tour } from '../domain/tour.model';
import { TourRepository } from '../domain/tour.repository';

export async function createTour(
  tourRepository: TourRepository,
  tourData: Omit<Tour, 'id'>
): Promise<string> {
  const newTour: Tour = {
    id: crypto.randomUUID(), // Or generate ID as needed
    ...tourData,
  };
  await tourRepository.save(newTour);
  return newTour.id;
}

    