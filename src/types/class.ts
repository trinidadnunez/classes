export type ClassCategory =
  | 'yoga'
  | 'hiit'
  | 'pilates'
  | 'boxing'
  | 'dance'
  | 'cycling'
  | 'stretching'
  | 'functional'
  | 'crossfit'
  | 'meditation';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'all_levels';

export interface ClassOffering {
  id: string;
  studioId: string;
  title: string;
  description: string;
  category: ClassCategory;
  difficulty: DifficultyLevel;
  duration: number;
  price?: number;
  instructorId: string;
  defaultCapacity: number;
  tags: string[];
  images: string[];
  rules?: string[];
  cancellationWindow: number;
}
