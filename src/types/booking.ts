export type BookingStatus = 'confirmed' | 'cancelled' | 'waitlisted';

export type CheckinStatus = 'pending' | 'checked_in' | 'no_show';

export interface Booking {
  id: string;
  userId: string;
  sessionId: string;
  status: BookingStatus;
  createdAt: string;
  cancelDeadline: string;
  checkinStatus: CheckinStatus;
}
