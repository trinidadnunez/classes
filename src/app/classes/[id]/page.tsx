'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin, Star, Users, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BookingPanel } from '@/components/booking/BookingPanel';
import { MapView } from '@/components/map/MapView';
import { MOCK_CLASSES } from '@/lib/mock-data/classes';
import { MOCK_STUDIOS } from '@/lib/mock-data/studios';
import { MOCK_INSTRUCTORS } from '@/lib/mock-data/instructors';
import { useMockData } from '@/providers/MockDataProvider';
import { CATEGORY_LABEL_MAP } from '@/constants/categories';

interface ClassDetailPageProps {
  params: Promise<{ id: string }>;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  all_levels: 'All Levels',
};

const ClassDetailPage = ({ params }: ClassDetailPageProps) => {
  const { id } = use(params);
  const { sessions } = useMockData();

  const classItem = MOCK_CLASSES.find((c) => c.id === id);
  const studio = classItem ? MOCK_STUDIOS.find((s) => s.id === classItem.studioId) : undefined;
  const instructor = classItem
    ? MOCK_INSTRUCTORS.find((i) => i.id === classItem.instructorId)
    : undefined;

  const classSessions = sessions.filter((s) => s.classId === id);

  if (!classItem || !studio) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Class not found</h1>
        <Button variant="outline" className="mt-4" render={<Link href="/" />}>
          Back to explore
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <Button variant="ghost" size="sm" className="mb-4" render={<Link href="/" />}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to explore
      </Button>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <div className="relative rounded-2xl bg-gradient-to-br from-muted to-muted/60 h-64 flex items-center justify-center overflow-hidden">
            <span className="text-7xl">
              {classItem.category === 'yoga' && '🧘'}
              {classItem.category === 'hiit' && '🔥'}
              {classItem.category === 'pilates' && '💪'}
              {classItem.category === 'boxing' && '🥊'}
              {classItem.category === 'dance' && '💃'}
              {classItem.category === 'cycling' && '🚴'}
              {classItem.category === 'stretching' && '🤸'}
              {classItem.category === 'functional' && '🏋️'}
              {classItem.category === 'crossfit' && '⚡'}
              {classItem.category === 'meditation' && '🧠'}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge>{CATEGORY_LABEL_MAP[classItem.category]}</Badge>
              <Badge variant="outline">{DIFFICULTY_LABELS[classItem.difficulty]}</Badge>
            </div>
            <h1 className="text-3xl font-bold">{classItem.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {classItem.duration} minutes
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Up to {classItem.defaultCapacity} people
              </span>
              {classItem.price && (
                <span className="font-semibold text-foreground">
                  ${classItem.price.toLocaleString('es-AR')}
                </span>
              )}
            </div>
            <p className="text-muted-foreground leading-relaxed">{classItem.description}</p>
          </div>

          <Separator />

          {instructor && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Instructor</h2>
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-xl font-bold shrink-0">
                  {instructor.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{instructor.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{instructor.bio}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {instructor.certifications.map((cert) => (
                      <Badge key={cert} variant="secondary" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <Separator />

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Studio</h2>
            <Link href={`/studios/${studio.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{studio.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {studio.address}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{studio.rating}</span>
                        <span className="text-xs text-muted-foreground">
                          ({studio.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {studio.facilities.slice(0, 3).map((f) => (
                        <Badge key={f} variant="secondary" className="text-xs">
                          {f}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <div className="h-48 rounded-lg overflow-hidden border">
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
          </div>

          {classItem.rules && classItem.rules.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Rules & Policies
                </h2>
                <ul className="space-y-2">
                  {classItem.rules.map((rule) => (
                    <li key={rule} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground shrink-0" />
                      {rule}
                    </li>
                  ))}
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground shrink-0" />
                    Cancellation window: {classItem.cancellationWindow} hours before class
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="lg:sticky lg:top-20 lg:self-start">
          <BookingPanel classItem={classItem} sessions={classSessions} />
        </div>
      </div>
    </div>
  );
};

export default ClassDetailPage;
