'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format, isPast, isFuture } from 'date-fns';
import { CalendarPlus, Clock, MapPin, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useMockData } from '@/providers/MockDataProvider';
import { MOCK_CLASSES } from '@/lib/mock-data/classes';
import { MOCK_STUDIOS } from '@/lib/mock-data/studios';

type BookingTab = 'upcoming' | 'past';

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  confirmed: 'default',
  waitlisted: 'secondary',
  cancelled: 'outline',
};

const BookingsPage = () => {
  const { bookings, sessions, cancelBooking, updateSessionSpots, currentRole } = useMockData();
  const [activeTab, setActiveTab] = useState<BookingTab>('upcoming');

  if (currentRole === 'guest') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="mt-2 text-muted-foreground">
          Sign in to see your bookings. Switch to &quot;Registered User&quot; role to continue.
        </p>
      </div>
    );
  }

  const userBookings = bookings.filter((b) => b.userId === 'user-1');

  const enrichedBookings = userBookings.map((booking) => {
    const session = sessions.find((s) => s.id === booking.sessionId);
    const classItem = session ? MOCK_CLASSES.find((c) => c.id === session.classId) : undefined;
    const studio = classItem ? MOCK_STUDIOS.find((s) => s.id === classItem.studioId) : undefined;
    return { booking, session, classItem, studio };
  });

  const upcoming = enrichedBookings.filter(
    (e) =>
      e.session &&
      isFuture(new Date(e.session.startTime)) &&
      e.booking.status !== 'cancelled'
  );

  const past = enrichedBookings.filter(
    (e) =>
      (e.session && isPast(new Date(e.session.startTime))) ||
      e.booking.status === 'cancelled'
  );

  const displayed = activeTab === 'upcoming' ? upcoming : past;

  const handleCancel = (bookingId: string, sessionId: string) => {
    cancelBooking(bookingId);
    updateSessionSpots(sessionId, 1);
    toast.success('Booking cancelled successfully.');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as BookingTab)}>
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({past.length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6 space-y-4">
        {displayed.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No {activeTab} bookings.</p>
            <Button variant="outline" className="mt-4" render={<Link href="/" />}>
              Explore Classes
            </Button>
          </div>
        ) : (
          displayed.map(({ booking, session, classItem, studio }) => {
            if (!session || !classItem || !studio) return null;
            const canCancel =
              booking.status === 'confirmed' &&
              isFuture(new Date(booking.cancelDeadline));

            return (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/classes/${classItem.id}`}
                          className="font-semibold hover:text-primary transition-colors truncate"
                        >
                          {classItem.title}
                        </Link>
                        <Badge variant={STATUS_VARIANT[booking.status] ?? 'outline'}>
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{studio.name}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {format(new Date(session.startTime), 'EEE, MMM d · h:mm a')}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {studio.address}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      {activeTab === 'upcoming' && (
                        <Button variant="outline" size="sm">
                          <CalendarPlus className="h-3.5 w-3.5 mr-1" />
                          Calendar
                        </Button>
                      )}
                      {canCancel && (
                        <AlertDialog>
                          <AlertDialogTrigger
                            className="inline-flex items-center gap-1 rounded-lg border border-input bg-transparent px-2.5 h-7 text-xs font-medium text-destructive hover:bg-destructive/10"
                          >
                            <X className="h-3.5 w-3.5" />
                            Cancel
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to cancel your booking for{' '}
                                <strong>{classItem.title}</strong> on{' '}
                                {format(new Date(session.startTime), 'EEEE, MMMM d at h:mm a')}?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                              <AlertDialogAction
                                variant="destructive"
                                onClick={() => handleCancel(booking.id, session.id)}
                              >
                                Confirm Cancel
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
