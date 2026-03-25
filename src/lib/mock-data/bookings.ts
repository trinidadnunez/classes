import { addDays, addHours, startOfDay, setHours } from 'date-fns';
import type { Booking } from '@/types/booking';

const today = startOfDay(new Date());

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'booking-1',
    userId: 'user-1',
    sessionId: 'session-class-1-0',
    status: 'confirmed',
    createdAt: addDays(today, -2).toISOString(),
    cancelDeadline: setHours(addDays(today, 0), 9).toISOString(),
    checkinStatus: 'pending',
  },
  {
    id: 'booking-2',
    userId: 'user-1',
    sessionId: 'session-class-7-2',
    status: 'confirmed',
    createdAt: addDays(today, -1).toISOString(),
    cancelDeadline: addHours(addDays(today, 1), 18).toISOString(),
    checkinStatus: 'pending',
  },
  {
    id: 'booking-3',
    userId: 'user-1',
    sessionId: 'session-class-5-0',
    status: 'confirmed',
    createdAt: addDays(today, -3).toISOString(),
    cancelDeadline: addHours(addDays(today, 0), 8).toISOString(),
    checkinStatus: 'pending',
  },
  {
    id: 'booking-4',
    userId: 'user-1',
    sessionId: 'session-class-9-0',
    status: 'waitlisted',
    createdAt: addDays(today, -1).toISOString(),
    cancelDeadline: addHours(addDays(today, 1), 20).toISOString(),
    checkinStatus: 'pending',
  },
  {
    id: 'booking-5',
    userId: 'user-1',
    sessionId: 'session-class-13-0',
    status: 'cancelled',
    createdAt: addDays(today, -5).toISOString(),
    cancelDeadline: addDays(today, -4).toISOString(),
    checkinStatus: 'pending',
  },
];
