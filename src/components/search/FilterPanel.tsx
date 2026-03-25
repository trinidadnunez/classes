'use client';

import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DIFFICULTY_OPTIONS, TIME_OF_DAY_OPTIONS, NEIGHBORHOOD_OPTIONS } from '@/constants/filters';
import type { SearchFilters } from '@/types/search';
import type { DifficultyLevel } from '@/types/class';
import type { TimeOfDay } from '@/types/search';

interface FilterPanelProps {
  filters: SearchFilters;
  onFilterChange: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  onReset: () => void;
  activeCount: number;
}

export const FilterPanel = ({ filters, onFilterChange, onReset, activeCount }: FilterPanelProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Filters</h3>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onReset}>
            Clear all ({activeCount})
          </Button>
        )}
      </div>

      <div>
        <label className="text-sm font-medium">Date</label>
        <Calendar
          mode="single"
          selected={filters.date ?? undefined}
          onSelect={(date) => onFilterChange('date', date ?? null)}
          className="mt-2 rounded-md border"
          disabled={{ before: new Date() }}
        />
      </div>

      <Separator />

      <div>
        <label className="text-sm font-medium">Time of Day</label>
        <Select
          value={filters.timeOfDay}
          onValueChange={(v) => onFilterChange('timeOfDay', (v ?? 'all') as TimeOfDay | 'all')}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIME_OF_DAY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label} {opt.range && <span className="text-muted-foreground">({opt.range})</span>}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <label className="text-sm font-medium">Difficulty</label>
        <Select
          value={filters.difficulty}
          onValueChange={(v) => onFilterChange('difficulty', (v ?? 'all') as DifficultyLevel | 'all')}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DIFFICULTY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <label className="text-sm font-medium">Neighborhood</label>
        <Select
          value={filters.neighborhood}
          onValueChange={(v) => onFilterChange('neighborhood', v ?? 'all')}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NEIGHBORHOOD_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
