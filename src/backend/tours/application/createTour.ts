
import { Tour } from '../domain/tour.model';
import { TourRepository } from '../domain/tour.repository';

export async function createTour(
  tourRepository: TourRepository,
  tourData: Tour
): Promise<string> {
  await tourRepository.save(tourData);
  return tourData.id;
}
