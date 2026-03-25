'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import type { Booking, BookingStatus } from '@/types/booking';
import type { UserRole } from '@/types/user';
import type { StudioStatus } from '@/types/studio';
import { MOCK_BOOKINGS } from '@/lib/mock-data/bookings';
import { MOCK_SESSIONS } from '@/lib/mock-data/sessions';
import type { Session } from '@/types/session';

interface MockDataState {
  bookings: Booking[];
  sessions: Session[];
  currentRole: UserRole;
  studioStatuses: Record<string, StudioStatus>;
}

interface MockDataContextValue extends MockDataState {
  setCurrentRole: (role: UserRole) => void;
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;
  updateSessionSpots: (sessionId: string, delta: number) => void;
  updateStudioStatus: (studioId: string, status: StudioStatus) => void;
  getBookingsByUser: (userId: string) => Booking[];
  getSessionById: (sessionId: string) => Session | undefined;
}

const MockDataContext = createContext<MockDataContextValue | null>(null);

interface MockDataProviderProps {
  children: React.ReactNode;
}

export const MockDataProvider = ({ children }: MockDataProviderProps) => {
  const [state, setState] = useState<MockDataState>({
    bookings: MOCK_BOOKINGS,
    sessions: MOCK_SESSIONS,
    currentRole: 'user',
    studioStatuses: {},
  });

  const setCurrentRole = useCallback((role: UserRole) => {
    setState((prev) => ({ ...prev, currentRole: role }));
  }, []);

  const addBooking = useCallback((booking: Booking) => {
    setState((prev) => ({ ...prev, bookings: [...prev.bookings, booking] }));
  }, []);

  const cancelBooking = useCallback((bookingId: string) => {
    setState((prev) => ({
      ...prev,
      bookings: prev.bookings.map((b) =>
        b.id === bookingId ? { ...b, status: 'cancelled' as BookingStatus } : b
      ),
    }));
  }, []);

  const updateSessionSpots = useCallback((sessionId: string, delta: number) => {
    setState((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) =>
        s.id === sessionId ? { ...s, spotsRemaining: Math.max(0, s.spotsRemaining + delta) } : s
      ),
    }));
  }, []);

  const updateStudioStatus = useCallback((studioId: string, status: StudioStatus) => {
    setState((prev) => ({
      ...prev,
      studioStatuses: { ...prev.studioStatuses, [studioId]: status },
    }));
  }, []);

  const getBookingsByUser = useCallback(
    (userId: string) => state.bookings.filter((b) => b.userId === userId),
    [state.bookings]
  );

  const getSessionById = useCallback(
    (sessionId: string) => state.sessions.find((s) => s.id === sessionId),
    [state.sessions]
  );

  return (
    <MockDataContext.Provider
      value={{
        ...state,
        setCurrentRole,
        addBooking,
        cancelBooking,
        updateSessionSpots,
        updateStudioStatus,
        getBookingsByUser,
        getSessionById,
      }}
    >
      {children}
    </MockDataContext.Provider>
  );
};

export const useMockData = (): MockDataContextValue => {
  const context = useContext(MockDataContext);
  if (!context) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
};
