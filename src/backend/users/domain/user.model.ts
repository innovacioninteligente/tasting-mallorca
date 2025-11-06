export type UserRole = 'customer' | 'guide' | 'admin';

export interface User {
  id: string; // Firebase Auth UID
  name: string;
  email: string;
  role: UserRole;
  stripeCustomerId?: string;
}
