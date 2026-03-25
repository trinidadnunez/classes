'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { icon } from 'leaflet';
import { BUENOS_AIRES_CENTER, DEFAULT_MAP_ZOOM, MAP_TILE_URL, MAP_ATTRIBUTION } from '@/constants/map';
import type { MapViewProps } from '@/components/map/MapView';
import 'leaflet/dist/leaflet.css';

const defaultIcon = icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const activeIcon = icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [30, 49],
  iconAnchor: [15, 49],
  popupAnchor: [1, -40],
  shadowSize: [49, 49],
});

export const MapInner = ({
  markers,
  center,
  zoom,
  onMarkerClick,
  selectedMarkerId,
}: MapViewProps) => {
  const mapCenter = center
    ? [center.lat, center.lng] as [number, number]
    : [BUENOS_AIRES_CENTER.lat, BUENOS_AIRES_CENTER.lng] as [number, number];

  return (
    <MapContainer
      center={mapCenter}
      zoom={zoom ?? DEFAULT_MAP_ZOOM}
      className="h-full w-full rounded-lg z-0"
      scrollWheelZoom
    >
      <TileLayer url={MAP_TILE_URL} attribution={MAP_ATTRIBUTION} />
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.position.lat, marker.position.lng]}
          icon={marker.id === selectedMarkerId ? activeIcon : defaultIcon}
          eventHandlers={{
            click: () => onMarkerClick?.(marker.id),
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{marker.label}</p>
              {marker.classCount !== undefined && (
                <p className="text-muted-foreground">{marker.classCount} classes</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
