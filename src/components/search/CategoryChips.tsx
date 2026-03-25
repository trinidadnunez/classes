'use client';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { CLASS_CATEGORIES } from '@/constants/categories';
import type { ClassCategory } from '@/types/class';

interface CategoryChipsProps {
  selected: ClassCategory | 'all';
  onSelect: (category: ClassCategory | 'all') => void;
}

export const CategoryChips = ({ selected, onSelect }: CategoryChipsProps) => {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-2">
        <Button
          variant={selected === 'all' ? 'default' : 'outline'}
          size="sm"
          className="rounded-full shrink-0"
          onClick={() => onSelect('all')}
        >
          All
        </Button>
        {CLASS_CATEGORIES.map((cat) => (
          <Button
            key={cat.value}
            variant={selected === cat.value ? 'default' : 'outline'}
            size="sm"
            className="rounded-full shrink-0"
            onClick={() => onSelect(cat.value)}
          >
            <span className="mr-1">{cat.icon}</span>
            {cat.label}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
