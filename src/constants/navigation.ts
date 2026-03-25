import type { UserRole } from '@/types/user';

export interface NavItem {
  label: string;
  href: string;
  roles: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Explore', href: '/', roles: ['guest', 'user', 'studio_manager', 'admin'] },
  { label: 'My Bookings', href: '/bookings', roles: ['user', 'studio_manager', 'admin'] },
  { label: 'Studio Dashboard', href: '/studio-dashboard', roles: ['studio_manager'] },
  { label: 'Admin', href: '/admin', roles: ['admin'] },
];

export const ROLE_LABELS: Record<UserRole, string> = {
  guest: 'Guest',
  user: 'Registered User',
  studio_manager: 'Studio Manager',
  admin: 'Platform Admin',
};
