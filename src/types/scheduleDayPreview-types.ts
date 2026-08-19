export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface ScheduleDayPreview {
  _id: string
  dayNumber: number
  label: string
  images: string[]
  downloadUrl?: string
  createdAt?: string
  updatedAt?: string
}
