export interface Event {
  _id: string;
  name: string;
  description: string;
  year: number;
  month: number;
  startDate: string;
  endDate: string;
  totalDays?: number;
  __v?: number;
}
export const months = [
  "January", "February", "March", "April", 
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

export interface EventDay {
  _id: string;
  event_ref: string;
  dayNumber: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  times?: EventTime[];
}

export interface EventTime {
  _id: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  type: string;
  speaker: string;
  __v: number;
  updatedAt?: string;
}

export interface CreateEventData {
  name: string;
  description: string;
  year: number;
  month: number;
  startDate: string;
  endDate: string;
}

export interface AddTimeData {
  eventId: string;
  eventDay_ref: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  type: string;
  speaker: string;
}

export interface EventWithDays {
  event: Event;
  days: EventDay[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
