'use client';

import { useMockData } from '@/providers/MockDataProvider';
import { ROLE_LABELS } from '@/constants/navigation';
import type { UserRole } from '@/types/user';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ROLES: UserRole[] = ['guest', 'user', 'studio_manager', 'admin'];

export const RoleSwitcher = () => {
  const { currentRole, setCurrentRole } = useMockData();

  return (
    <Select value={currentRole} onValueChange={(v) => setCurrentRole(v as UserRole)}>
      <SelectTrigger className="w-[160px] h-8 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ROLES.map((role) => (
          <SelectItem key={role} value={role} className="text-xs">
            {ROLE_LABELS[role]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
