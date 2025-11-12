import { PrivateTourRequest } from '../domain/private-tour-request.model';
import { PrivateTourRequestRepository } from '../domain/private-tour-request.repository';

export async function createPrivateTourRequest(
  repository: PrivateTourRequestRepository,
  requestData: PrivateTourRequest
): Promise<string> {
  await repository.save(requestData);
  return requestData.id;
}
