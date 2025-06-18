export interface ScheduleEvent {
  id: string;
  time: string;
  event: string;
  description?: string;
  speaker?: string;
  location?: string;
  duration?: string;
  type?: 'keynote' | 'panel' | 'workshop' | 'break' | 'networking';
}

export interface DaySchedule {
  day: string;
  date: string;
  events: ScheduleEvent[];
}

export interface ScheduleData {
  festivalName: string;
  year: string;
  days: DaySchedule[];
}

export interface ScheduleResponse {
  success: boolean;
  data: ScheduleData;
  message?: string;
} 