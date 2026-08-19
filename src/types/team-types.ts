export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface TeamMember {
  _id: string
  title: string
  description?: string
  designation?: string
  image_url?: string
  order?: number
  createdAt?: string
  updatedAt?: string
}
