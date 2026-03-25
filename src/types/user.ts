export type UserRole = 'guest' | 'user' | 'studio_manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  role: UserRole;
  preferences?: string[];
  joinedDate: string;
  lastActive: string;
}
