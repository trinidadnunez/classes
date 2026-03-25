import type { ClassCategory, DifficultyLevel } from '@/types/class';

export type TimeOfDay = 'early_morning' | 'morning' | 'afternoon' | 'evening';

export interface SearchFilters {
  text: string;
  category: ClassCategory | 'all';
  date: Date | null;
  timeOfDay: TimeOfDay | 'all';
  difficulty: DifficultyLevel | 'all';
  priceRange: [number, number] | null;
  neighborhood: string | 'all';
}
