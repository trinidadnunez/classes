import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onReset: () => void;
}

export const EmptyState = ({ onReset }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <SearchX className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">No classes found</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        Try adjusting your search or filters to find more exercise classes in Buenos Aires.
      </p>
      <Button variant="outline" className="mt-4" onClick={onReset}>
        Clear all filters
      </Button>
    </div>
  );
};
