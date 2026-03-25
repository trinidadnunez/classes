import type { ClassCategory } from '@/types/class';

export const CLASS_CATEGORIES: { value: ClassCategory; label: string; icon: string }[] = [
  { value: 'yoga', label: 'Yoga', icon: '🧘' },
  { value: 'hiit', label: 'HIIT', icon: '🔥' },
  { value: 'pilates', label: 'Pilates', icon: '💪' },
  { value: 'boxing', label: 'Boxing', icon: '🥊' },
  { value: 'dance', label: 'Dance', icon: '💃' },
  { value: 'cycling', label: 'Cycling', icon: '🚴' },
  { value: 'stretching', label: 'Stretching', icon: '🤸' },
  { value: 'functional', label: 'Functional', icon: '🏋️' },
  { value: 'crossfit', label: 'CrossFit', icon: '⚡' },
  { value: 'meditation', label: 'Meditation', icon: '🧠' },
];

export const CATEGORY_LABEL_MAP: Record<ClassCategory, string> = Object.fromEntries(
  CLASS_CATEGORIES.map((c) => [c.value, c.label])
) as Record<ClassCategory, string>;
