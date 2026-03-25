export type SessionStatus = 'scheduled' | 'cancelled' | 'completed';

export interface Session {
  id: string;
  classId: string;
  startTime: string;
  endTime: string;
  capacityOverride?: number;
  spotsRemaining: number;
  status: SessionStatus;
}
