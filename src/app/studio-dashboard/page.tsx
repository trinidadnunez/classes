'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import {
  BookOpen,
  Calendar,
  Clock,
  Plus,
  Users,
  BarChart3,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useMockData } from '@/providers/MockDataProvider';
import { MOCK_CLASSES } from '@/lib/mock-data/classes';
import { MOCK_STUDIOS } from '@/lib/mock-data/studios';
import { CATEGORY_LABEL_MAP } from '@/constants/categories';

const MANAGER_STUDIO_ID = 'studio-1';

const StudioDashboardPage = () => {
  const { sessions, bookings, currentRole } = useMockData();

  if (currentRole !== 'studio_manager') {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Studio Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Switch to &quot;Studio Manager&quot; role to access this page.
        </p>
      </div>
    );
  }

  const studio = MOCK_STUDIOS.find((s) => s.id === MANAGER_STUDIO_ID);
  const studioClasses = MOCK_CLASSES.filter((c) => c.studioId === MANAGER_STUDIO_ID);
  const studioSessionIds = new Set(
    sessions.filter((s) => studioClasses.some((c) => c.id === s.classId)).map((s) => s.id)
  );
  const studioBookings = bookings.filter((b) => studioSessionIds.has(b.sessionId));

  const upcomingSessions = sessions
    .filter(
      (s) =>
        studioClasses.some((c) => c.id === s.classId) &&
        s.status === 'scheduled' &&
        new Date(s.startTime) > new Date()
    )
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const confirmedBookings = studioBookings.filter((b) => b.status === 'confirmed');

  const classBookingCounts = studioClasses.map((cls) => {
    const classSessions = sessions.filter((s) => s.classId === cls.id);
    const sessionIds = new Set(classSessions.map((s) => s.id));
    const count = studioBookings.filter(
      (b) => sessionIds.has(b.sessionId) && b.status === 'confirmed'
    ).length;
    return { classItem: cls, count };
  });

  const maxCount = Math.max(...classBookingCounts.map((c) => c.count), 1);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Studio Dashboard</h1>
          <p className="text-muted-foreground">{studio?.name ?? 'Your Studio'}</p>
        </div>
        <Button render={<Link href="/studio-dashboard/classes/new" />}>
          <Plus className="h-4 w-4 mr-1" />
          New Class
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{studioClasses.length}</p>
              <p className="text-xs text-muted-foreground">Active Classes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{upcomingSessions.length}</p>
              <p className="text-xs text-muted-foreground">Upcoming Sessions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <Users className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{confirmedBookings.length}</p>
              <p className="text-xs text-muted-foreground">Total Bookings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <BarChart3 className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {studioClasses.length > 0
                  ? Math.round(confirmedBookings.length / studioClasses.length)
                  : 0}
              </p>
              <p className="text-xs text-muted-foreground">Avg Bookings/Class</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Your Classes</h2>
            <div className="space-y-3">
              {studioClasses.map((cls) => {
                const nextSession = upcomingSessions.find((s) => s.classId === cls.id);
                return (
                  <Card key={cls.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold truncate">{cls.title}</h3>
                            <Badge variant="secondary" className="text-xs shrink-0">
                              {CATEGORY_LABEL_MAP[cls.category]}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {cls.duration} min
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {cls.defaultCapacity} spots
                            </span>
                            {nextSession && (
                              <span>
                                Next: {format(new Date(nextSession.startTime), 'MMM d, h:mm a')}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" render={<Link href={`/classes/${cls.id}`} />}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-semibold mb-4">Upcoming Sessions</h2>
            <div className="space-y-2">
              {upcomingSessions.slice(0, 8).map((session) => {
                const cls = MOCK_CLASSES.find((c) => c.id === session.classId);
                const sessionBookings = studioBookings.filter(
                  (b) => b.sessionId === session.id && b.status === 'confirmed'
                );
                if (!cls) return null;
                const capacity = session.capacityOverride ?? cls.defaultCapacity;
                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{cls.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(session.startTime), 'EEE, MMM d · h:mm a')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {sessionBookings.length}/{capacity}
                      </p>
                      <p className="text-xs text-muted-foreground">booked</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Bookings by Class
              </h3>
              <div className="space-y-3">
                {classBookingCounts.map(({ classItem, count }) => (
                  <div key={classItem.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="truncate mr-2">{classItem.title}</span>
                      <span className="text-muted-foreground shrink-0">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      />
                    </div>
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

export default StudioDashboardPage;
