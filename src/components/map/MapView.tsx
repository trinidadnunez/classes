'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { GeoCoordinates } from '@/types/studio';

interface MapMarker {
  id: string;
  position: GeoCoordinates;
  label: string;
  classCount?: number;
}

interface MapViewProps {
  markers: MapMarker[];
  center?: GeoCoordinates;
  zoom?: number;
  onMarkerClick?: (id: string) => void;
  className?: string;
  selectedMarkerId?: string;
}

const MapInner = dynamic(() => import('@/components/map/MapInner').then((m) => m.MapInner), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full rounded-lg" />,
});

export const MapView = (props: MapViewProps) => {
  return (
    <div className={`relative ${props.className ?? 'h-full w-full'}`}>
      <MapInner {...props} />
    </div>
  );
};

export type { MapMarker, MapViewProps };
