import { Tour } from '../domain/tour.model';
import { TourRepository } from '../domain/tour.repository';

export async function updateTour(
  tourRepository: TourRepository,
  tourData: Partial<Tour> & { id: string }
): Promise<void> {
  await tourRepository.update(tourData);
}
