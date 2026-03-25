'use client';

import Link from 'next/link';
import { Clock, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CATEGORY_LABEL_MAP } from '@/constants/categories';
import type { ClassOffering } from '@/types/class';
import type { Studio } from '@/types/studio';
import type { Session } from '@/types/session';

interface ClassCardProps {
  classItem: ClassOffering;
  studio: Studio;
  nextSession?: Session;
  highlighted?: boolean;
}

export const ClassCard = ({ classItem, studio, nextSession, highlighted }: ClassCardProps) => {
  const categoryColor = highlighted
    ? 'bg-primary text-primary-foreground'
    : 'bg-secondary text-secondary-foreground';

  return (
    <Link href={`/classes/${classItem.id}`}>
      <Card
        className={`group overflow-hidden transition-all hover:shadow-md ${
          highlighted ? 'ring-2 ring-primary' : ''
        }`}
      >
        <div className="relative h-40 bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center">
          <span className="text-4xl">
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
          <Badge className={`absolute top-3 left-3 ${categoryColor}`}>
            {CATEGORY_LABEL_MAP[classItem.category]}
          </Badge>
          {classItem.price && (
            <Badge variant="secondary" className="absolute top-3 right-3 bg-background/90">
              ${classItem.price.toLocaleString('es-AR')}
            </Badge>
          )}
        </div>
        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-1">
              {classItem.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{studio.name}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {classItem.duration} min
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {studio.neighborhood.charAt(0).toUpperCase() + studio.neighborhood.slice(1)}
            </span>
            {nextSession && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {nextSession.spotsRemaining} spots
              </span>
            )}
          </div>
          {nextSession && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-medium text-primary">
                Next: {format(new Date(nextSession.startTime), 'EEE, MMM d · h:mm a')}
              </span>
              <Button size="sm" className="h-7 text-xs">
                Reserve
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
