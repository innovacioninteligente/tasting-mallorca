import { PrivateTourRequest } from './private-tour-request.model';

export interface PrivateTourRequestRepository {
  save(request: PrivateTourRequest): Promise<void>;
  findAll(): Promise<PrivateTourRequest[]>;
  findById(id: string): Promise<PrivateTourRequest | null>;
}
