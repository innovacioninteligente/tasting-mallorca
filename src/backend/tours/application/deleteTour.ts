
import { TourRepository } from '../domain/tour.repository';

export async function deleteTour(
  tourRepository: TourRepository,
  id: string
): Promise<void> {
  await tourRepository.delete(id);
}
