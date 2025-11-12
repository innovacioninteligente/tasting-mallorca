
import { GuestFeedback } from './feedback.model';

export interface FeedbackRepository {
  findById(id: string): Promise<GuestFeedback | null>;
  findAll(): Promise<GuestFeedback[]>;
  save(feedback: GuestFeedback): Promise<void>;
  update(feedback: Partial<GuestFeedback> & { id: string }): Promise<void>;
  delete(id: string): Promise<void>;
}
