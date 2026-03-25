import { addDays, addHours, setHours, setMinutes, startOfDay } from 'date-fns';
import type { Session } from '@/types/session';

const generateSessionsForClass = (
  classId: string,
  defaultCapacity: number,
  hoursOptions: number[],
  daysPattern: number[],
  startOffset: number = 0
): Session[] => {
  const today = startOfDay(new Date());
  const sessions: Session[] = [];
  let sessionIdx = 0;

  for (const dayOffset of daysPattern) {
    for (const hour of hoursOptions) {
      const start = setMinutes(setHours(addDays(today, dayOffset + startOffset), hour), 0);
      const durationMap: Record<string, number> = {
        'class-1': 60, 'class-2': 30, 'class-3': 45, 'class-4': 45,
        'class-5': 50, 'class-6': 55, 'class-7': 45, 'class-8': 50,
        'class-9': 60, 'class-10': 75, 'class-11': 60, 'class-12': 75,
        'class-13': 75, 'class-14': 45, 'class-15': 50, 'class-16': 30,
        'class-17': 60, 'class-18': 75, 'class-19': 50, 'class-20': 45,
      };
      const duration = durationMap[classId] ?? 60;
      const end = addHours(start, duration / 60);
      const seed = (dayOffset * 100 + hour * 7 + sessionIdx * 13) % 100;
      const spotsUsed = Math.floor((seed / 100) * (defaultCapacity * 0.8));
      const spotsRemaining = Math.max(0, defaultCapacity - spotsUsed);

      sessions.push({
        id: `session-${classId}-${sessionIdx}`,
        classId,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        spotsRemaining,
        status: dayOffset < 0 ? 'completed' : 'scheduled',
      });
      sessionIdx++;
    }
  }

  return sessions;
};

const weekdayPattern = [0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12];
const mwfPattern = [0, 2, 4, 7, 9, 11];
const tthPattern = [1, 3, 8, 10];
const weekendPattern = [5, 6, 12, 13];

export const MOCK_SESSIONS: Session[] = [
  ...generateSessionsForClass('class-1', 20, [9, 18], mwfPattern),
  ...generateSessionsForClass('class-2', 15, [7], weekdayPattern),
  ...generateSessionsForClass('class-3', 16, [10, 19], tthPattern),
  ...generateSessionsForClass('class-4', 20, [18, 20], mwfPattern),
  ...generateSessionsForClass('class-5', 10, [8, 10, 17], mwfPattern),
  ...generateSessionsForClass('class-6', 18, [9, 16], tthPattern),
  ...generateSessionsForClass('class-7', 30, [7, 12, 18], weekdayPattern),
  ...generateSessionsForClass('class-8', 30, [6, 17], mwfPattern),
  ...generateSessionsForClass('class-9', 24, [20], tthPattern),
  ...generateSessionsForClass('class-10', 16, [18], mwfPattern),
  ...generateSessionsForClass('class-11', 20, [7, 9, 17, 19], weekdayPattern),
  ...generateSessionsForClass('class-12', 8, [10], tthPattern),
  ...generateSessionsForClass('class-13', 18, [8, 18], mwfPattern),
  ...generateSessionsForClass('class-14', 20, [12], weekdayPattern),
  ...generateSessionsForClass('class-15', 16, [7, 18], mwfPattern),
  ...generateSessionsForClass('class-16', 24, [6, 12], tthPattern),
  ...generateSessionsForClass('class-17', 12, [6], weekdayPattern),
  ...generateSessionsForClass('class-18', 12, [19], tthPattern),
  ...generateSessionsForClass('class-19', 20, [10, 19], mwfPattern),
  ...generateSessionsForClass('class-20', 20, [7, 17], weekdayPattern),
  // Some sessions manually set to full for testing waitlist
  {
    id: 'session-full-1',
    classId: 'class-5',
    startTime: addDays(startOfDay(new Date()), 1).toISOString(),
    endTime: addHours(addDays(startOfDay(new Date()), 1), 1).toISOString(),
    spotsRemaining: 0,
    status: 'scheduled',
  },
  {
    id: 'session-full-2',
    classId: 'class-12',
    startTime: setHours(addDays(startOfDay(new Date()), 2), 10).toISOString(),
    endTime: setHours(addDays(startOfDay(new Date()), 2), 11).toISOString(),
    spotsRemaining: 0,
    status: 'scheduled',
  },
];
