import { PrivateTourRequest } from '../domain/private-tour-request.model';
import { PrivateTourRequestRepository } from '../domain/private-tour-request.repository';

export async function findAllPrivateTourRequests(
  repository: PrivateTourRequestRepository
): Promise<PrivateTourRequest[]> {
  return repository.findAll();
}

export async function findPrivateTourRequestById(
  repository: PrivateTourRequestRepository,
  id: string
): Promise<PrivateTourRequest | null> {
    return repository.findById(id);
}
