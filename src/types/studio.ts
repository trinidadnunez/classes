export type StudioStatus = 'approved' | 'pending' | 'disabled';

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface OperatingHours {
  day: string;
  open: string;
  close: string;
}

export interface Studio {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  geoCoordinates: GeoCoordinates;
  description: string;
  images: string[];
  facilities: string[];
  operatingHours: OperatingHours[];
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  managerUserId: string;
  status: StudioStatus;
  rating: number;
  reviewCount: number;
}
