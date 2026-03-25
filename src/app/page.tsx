'use client';

import { useState } from 'react';
import { SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import { useMockData } from '@/providers/MockDataProvider';
import { useSearch } from '@/hooks/useSearch';
import { SearchBar } from '@/components/search/SearchBar';
import { CategoryChips } from '@/components/search/CategoryChips';
import { FilterPanel } from '@/components/search/FilterPanel';
import { ClassCard } from '@/components/classes/ClassCard';
import { EmptyState } from '@/components/classes/EmptyState';
import { MapView } from '@/components/map/MapView';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { MOCK_STUDIOS } from '@/lib/mock-data/studios';
import type { MapMarker } from '@/components/map/MapView';

type ViewMode = 'grid' | 'list';

const HomePage = () => {
  const { sessions } = useMockData();
  const {
    filters,
    updateFilter,
    resetFilters,
    filteredClasses,
    getStudioForClass,
    getNextSession,
    activeFilterCount,
  } = useSearch(sessions);

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedStudioId, setSelectedStudioId] = useState<string | undefined>();
  const [showMap, setShowMap] = useState(true);

  const studioIdsInResults = new Set(filteredClasses.map((c) => c.studioId));
  const markers: MapMarker[] = MOCK_STUDIOS.filter(
    (s) => s.status === 'approved' && studioIdsInResults.has(s.id)
  ).map((s) => ({
    id: s.id,
    position: s.geoCoordinates,
    label: s.name,
    classCount: filteredClasses.filter((c) => c.studioId === s.id).length,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="space-y-2 mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Discover exercise classes in Buenos Aires
        </h1>
        <p className="text-muted-foreground">
          Find and book yoga, HIIT, Pilates, boxing, and more across the city.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <SearchBar value={filters.text} onChange={(v) => updateFilter('text', v)} />
        <CategoryChips
          selected={filters.category}
          onSelect={(v) => updateFilter('category', v)}
        />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Sheet>
          <SheetTrigger
            className="lg:hidden inline-flex items-center gap-1.5 rounded-lg border border-input bg-transparent px-2.5 h-7 text-[0.8rem] font-medium hover:bg-muted"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                {activeFilterCount}
              </Badge>
            )}
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetTitle>Filters</SheetTitle>
            <div className="mt-4">
              <FilterPanel
                filters={filters}
                onFilterChange={updateFilter}
                onReset={resetFilters}
                activeCount={activeFilterCount}
              />
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex-1" />

        <span className="text-sm text-muted-foreground">
          {filteredClasses.length} classes found
        </span>

        <div className="hidden sm:flex items-center gap-1 border rounded-lg p-0.5">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-7 w-7"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-7 w-7"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="hidden md:flex"
          onClick={() => setShowMap(!showMap)}
        >
          {showMap ? 'Hide Map' : 'Show Map'}
        </Button>
      </div>

      <div className="flex gap-6">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-20">
            <FilterPanel
              filters={filters}
              onFilterChange={updateFilter}
              onReset={resetFilters}
              activeCount={activeFilterCount}
            />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className={`flex gap-6 ${showMap ? '' : ''}`}>
            <div className={`flex-1 min-w-0 ${showMap ? 'md:w-1/2' : ''}`}>
              {filteredClasses.length === 0 ? (
                <EmptyState onReset={resetFilters} />
              ) : (
                <div
                  className={
                    viewMode === 'grid'
                      ? `grid gap-4 ${showMap ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'}`
                      : 'flex flex-col gap-3'
                  }
                >
                  {filteredClasses.map((cls) => {
                    const studio = getStudioForClass(cls);
                    if (!studio) return null;
                    return (
                      <ClassCard
                        key={cls.id}
                        classItem={cls}
                        studio={studio}
                        nextSession={getNextSession(cls.id)}
                        highlighted={studio.id === selectedStudioId}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {showMap && (
              <div className="hidden md:block w-1/2 shrink-0">
                <div className="sticky top-20 h-[calc(100vh-8rem)] rounded-lg overflow-hidden border">
                  <MapView
                    markers={markers}
                    selectedMarkerId={selectedStudioId}
                    onMarkerClick={(id) =>
                      setSelectedStudioId(id === selectedStudioId ? undefined : id)
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
