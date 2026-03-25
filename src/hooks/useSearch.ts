'use client';

import { useMemo, useState } from 'react';
import { isAfter, startOfDay, getHours } from 'date-fns';
import type { SearchFilters, TimeOfDay } from '@/types/search';
import type { ClassOffering } from '@/types/class';
import type { Session } from '@/types/session';
import type { Studio } from '@/types/studio';
import { DEFAULT_FILTERS } from '@/constants/filters';
import { MOCK_CLASSES } from '@/lib/mock-data/classes';
import { MOCK_STUDIOS } from '@/lib/mock-data/studios';

const isInTimeOfDay = (hour: number, tod: TimeOfDay): boolean => {
  switch (tod) {
    case 'early_morning': return hour >= 6 && hour < 9;
    case 'morning': return hour >= 9 && hour < 12;
    case 'afternoon': return hour >= 12 && hour < 17;
    case 'evening': return hour >= 17 && hour < 22;
    default: return true;
  }
};

interface UseSearchReturn {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  updateFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  resetFilters: () => void;
  filteredClasses: ClassOffering[];
  getStudioForClass: (classItem: ClassOffering) => Studio | undefined;
  getNextSession: (classId: string) => Session | undefined;
  activeFilterCount: number;
}

export const useSearch = (sessions: Session[]): UseSearchReturn => {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const now = new Date();
  const todayStart = startOfDay(now);

  const futureSessions = useMemo(
    () => sessions.filter((s) => s.status === 'scheduled' && isAfter(new Date(s.startTime), todayStart)),
    [sessions, todayStart]
  );

  const filteredClasses = useMemo(() => {
    return MOCK_CLASSES.filter((cls) => {
      const studio = MOCK_STUDIOS.find((s) => s.id === cls.studioId);
      if (!studio || studio.status !== 'approved') return false;

      if (filters.text) {
        const search = filters.text.toLowerCase();
        const match =
          cls.title.toLowerCase().includes(search) ||
          cls.description.toLowerCase().includes(search) ||
          cls.category.toLowerCase().includes(search) ||
          studio.name.toLowerCase().includes(search) ||
          cls.tags.some((t) => t.toLowerCase().includes(search));
        if (!match) return false;
      }

      if (filters.category !== 'all' && cls.category !== filters.category) return false;
      if (filters.difficulty !== 'all' && cls.difficulty !== filters.difficulty) return false;

      if (filters.neighborhood !== 'all' && studio.neighborhood !== filters.neighborhood) return false;

      const classSessions = futureSessions.filter((s) => s.classId === cls.id);
      if (classSessions.length === 0) return false;

      if (filters.date) {
        const filterDay = startOfDay(filters.date);
        const hasSessionOnDay = classSessions.some(
          (s) => startOfDay(new Date(s.startTime)).getTime() === filterDay.getTime()
        );
        if (!hasSessionOnDay) return false;
      }

      if (filters.timeOfDay !== 'all') {
        const hasTimeMatch = classSessions.some((s) =>
          isInTimeOfDay(getHours(new Date(s.startTime)), filters.timeOfDay as TimeOfDay)
        );
        if (!hasTimeMatch) return false;
      }

      if (filters.priceRange) {
        const price = cls.price ?? 0;
        if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
      }

      return true;
    });
  }, [filters, futureSessions]);

  const getStudioForClass = (classItem: ClassOffering) =>
    MOCK_STUDIOS.find((s) => s.id === classItem.studioId);

  const getNextSession = (classId: string) =>
    futureSessions
      .filter((s) => s.classId === classId)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];

  const activeFilterCount = [
    filters.text !== '',
    filters.category !== 'all',
    filters.date !== null,
    filters.timeOfDay !== 'all',
    filters.difficulty !== 'all',
    filters.priceRange !== null,
    filters.neighborhood !== 'all',
  ].filter(Boolean).length;

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    filteredClasses,
    getStudioForClass,
    getNextSession,
    activeFilterCount,
  };
};
