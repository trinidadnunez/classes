import type { User } from '@/types/user';

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    name: 'María González',
    email: 'maria@example.com',
    phone: '+54 11 5555-1234',
    role: 'user',
    profilePicture: '/images/users/maria.jpg',
    preferences: ['yoga', 'pilates', 'meditation'],
    joinedDate: '2025-06-15T00:00:00Z',
    lastActive: new Date().toISOString(),
  },
  {
    id: 'user-studio-1',
    name: 'Roberto Paz',
    email: 'roberto@zenflow.com.ar',
    role: 'studio_manager',
    joinedDate: '2025-01-10T00:00:00Z',
    lastActive: new Date().toISOString(),
  },
  {
    id: 'user-admin-1',
    name: 'Admin Principal',
    email: 'admin@classesba.com',
    role: 'admin',
    joinedDate: '2024-12-01T00:00:00Z',
    lastActive: new Date().toISOString(),
  },
];

export const DEFAULT_MOCK_USER = MOCK_USERS[0];
