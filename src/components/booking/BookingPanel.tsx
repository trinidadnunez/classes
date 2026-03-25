'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarPlus, Check, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useMockData } from '@/providers/MockDataProvider';
import type { Session } from '@/types/session';
import type { ClassOffering } from '@/types/class';

interface BookingPanelProps {
  classItem: ClassOffering;
  sessions: Session[];
}

type BookingStep = 'select' | 'confirm' | 'success';

export const BookingPanel = ({ classItem, sessions }: BookingPanelProps) => {
  const { currentRole, addBooking, updateSessionSpots } = useMockData();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [step, setStep] = useState<BookingStep>('select');

  const upcomingSessions = sessions
    .filter((s) => s.status === 'scheduled' && new Date(s.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 10);

  const handleConfirmBooking = () => {
    if (!selectedSession) return;

    if (currentRole === 'guest') {
      toast.error('Please sign in to book a class. Switch to "Registered User" role to continue.');
      return;
    }

    const isWaitlist = selectedSession.spotsRemaining === 0;

    addBooking({
      id: `booking-${Date.now()}`,
      userId: 'user-1',
      sessionId: selectedSession.id,
      status: isWaitlist ? 'waitlisted' : 'confirmed',
      createdAt: new Date().toISOString(),
      cancelDeadline: new Date(
        new Date(selectedSession.startTime).getTime() - classItem.cancellationWindow * 60 * 60 * 1000
      ).toISOString(),
      checkinStatus: 'pending',
    });

    if (!isWaitlist) {
      updateSessionSpots(selectedSession.id, -1);
    }

    setStep('success');
    toast.success(isWaitlist ? 'Added to waitlist!' : 'Booking confirmed!');
  };

  const handleReset = () => {
    setSelectedSession(null);
    setStep('select');
  };

  if (step === 'success') {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="p-6 text-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mx-auto">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Booking Confirmed!</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {classItem.title} on{' '}
              {selectedSession && format(new Date(selectedSession.startTime), 'EEEE, MMMM d · h:mm a')}
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm">
              <CalendarPlus className="h-4 w-4 mr-1" />
              Add to Calendar
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Book Another
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h3 className="font-semibold text-lg">Reserve a Spot</h3>

        {step === 'select' && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Select a session:</p>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {upcomingSessions.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No upcoming sessions available.
                </p>
              ) : (
                upcomingSessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedSession?.id === session.id
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'hover:border-muted-foreground/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          {format(new Date(session.startTime), 'EEEE, MMM d')}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(session.startTime), 'h:mm a')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {session.spotsRemaining} spots left
                          </span>
                        </div>
                      </div>
                      {session.spotsRemaining === 0 && (
                        <Badge variant="secondary" className="text-xs">Full</Badge>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
            {selectedSession && (
              <Button className="w-full" onClick={() => setStep('confirm')}>
                {selectedSession.spotsRemaining === 0 ? 'Join Waitlist' : 'Continue'}
              </Button>
            )}
          </div>
        )}

        {step === 'confirm' && selectedSession && (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <p className="font-medium">{classItem.title}</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(selectedSession.startTime), 'EEEE, MMMM d · h:mm a')}
              </p>
              <p className="text-sm text-muted-foreground">
                Duration: {classItem.duration} min
              </p>
              {classItem.price && (
                <p className="text-sm font-medium">
                  Price: ${classItem.price.toLocaleString('es-AR')}
                </p>
              )}
            </div>
            <Separator />
            {currentRole === 'guest' && (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                You need to sign in to complete this booking. Switch to &quot;Registered User&quot; role above.
              </p>
            )}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep('select')}>
                Back
              </Button>
              <Button className="flex-1" onClick={handleConfirmBooking}>
                {selectedSession.spotsRemaining === 0 ? 'Join Waitlist' : 'Confirm Booking'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
