export interface ViewCounter {
  _id: string;
  views: number;
  uniqueUser:string[];
  date: Date;
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}