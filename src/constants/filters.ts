import type { DifficultyLevel } from '@/types/class';
import type { TimeOfDay, SearchFilters } from '@/types/search';

export const DIFFICULTY_OPTIONS: { value: DifficultyLevel | 'all'; label: string }[] = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'all_levels', label: 'All Levels (Class)' },
];

export const TIME_OF_DAY_OPTIONS: { value: TimeOfDay | 'all'; label: string; range: string }[] = [
  { value: 'all', label: 'Any Time', range: '' },
  { value: 'early_morning', label: 'Early Morning', range: '6:00 - 9:00' },
  { value: 'morning', label: 'Morning', range: '9:00 - 12:00' },
  { value: 'afternoon', label: 'Afternoon', range: '12:00 - 17:00' },
  { value: 'evening', label: 'Evening', range: '17:00 - 21:00' },
];

export const NEIGHBORHOOD_OPTIONS = [
  { value: 'all', label: 'All Neighborhoods' },
  { value: 'palermo', label: 'Palermo' },
  { value: 'recoleta', label: 'Recoleta' },
  { value: 'san-telmo', label: 'San Telmo' },
  { value: 'belgrano', label: 'Belgrano' },
  { value: 'nuñez', label: 'Núñez' },
  { value: 'caballito', label: 'Caballito' },
  { value: 'villa-crespo', label: 'Villa Crespo' },
  { value: 'colegiales', label: 'Colegiales' },
];

export const DEFAULT_FILTERS: SearchFilters = {
  text: '',
  category: 'all',
  date: null,
  timeOfDay: 'all',
  difficulty: 'all',
  priceRange: null,
  neighborhood: 'all',
};
