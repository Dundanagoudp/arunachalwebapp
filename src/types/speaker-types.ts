export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface Event {
  _id: string
  name: string
  description: string
  year: number
  month: number
  startDate: string
  endDate: string
  totalDays: number
}

export interface Speaker {
  _id: string
  event_ref: string
  name: string
  about: string
  image_url: string
  __v: number
}
