'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin, Star, Phone, Mail, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapView } from '@/components/map/MapView';
import { ClassCard } from '@/components/classes/ClassCard';
import { MOCK_STUDIOS } from '@/lib/mock-data/studios';
import { MOCK_CLASSES } from '@/lib/mock-data/classes';
import { useMockData } from '@/providers/MockDataProvider';

interface StudioPageProps {
  params: Promise<{ id: string }>;
}

const StudioPage = ({ params }: StudioPageProps) => {
  const { id } = use(params);
  const { sessions } = useMockData();

  const studio = MOCK_STUDIOS.find((s) => s.id === id);
  const studioClasses = MOCK_CLASSES.filter((c) => c.studioId === id);

  if (!studio) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Studio not found</h1>
        <Button variant="outline" className="mt-4" render={<Link href="/" />}>
          Back to explore
        </Button>
      </div>
    );
  }

  const getNextSession = (classId: string) =>
    sessions
      .filter((s) => s.classId === classId && s.status === 'scheduled' && new Date(s.startTime) > new Date())
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <Button variant="ghost" size="sm" className="mb-4" render={<Link href="/" />}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to explore
      </Button>

      <div className="relative rounded-2xl bg-gradient-to-br from-muted to-muted/60 h-48 flex items-center justify-center overflow-hidden mb-6">
        <span className="text-6xl font-bold text-muted-foreground/30">
          {studio.name.charAt(0)}
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{studio.name}</h1>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{studio.rating}</span>
                <span className="text-sm text-muted-foreground">({studio.reviewCount})</span>
              </div>
            </div>
            <p className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {studio.address}
            </p>
            <p className="text-muted-foreground leading-relaxed">{studio.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {studio.facilities.map((f) => (
              <Badge key={f} variant="secondary">{f}</Badge>
            ))}
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Classes ({studioClasses.length})</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {studioClasses.map((cls) => (
                <ClassCard
                  key={cls.id}
                  classItem={cls}
                  studio={studio}
                  nextSession={getNextSession(cls.id)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <div className="h-56 rounded-lg overflow-hidden border">
            <MapView
              markers={[
                {
                  id: studio.id,
                  position: studio.geoCoordinates,
                  label: studio.name,
                },
              ]}
              center={studio.geoCoordinates}
              zoom={15}
            />
          </div>

          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold">Contact</h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0" />
                  {studio.contactInfo.phone}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 shrink-0" />
                  {studio.contactInfo.email}
                </p>
                {studio.contactInfo.website && (
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="h-4 w-4 shrink-0" />
                    {studio.contactInfo.website}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold">Operating Hours</h3>
              <div className="space-y-1.5">
                {studio.operatingHours.map((h) => (
                  <div key={h.day} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{h.day}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {h.open} - {h.close}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudioPage;
