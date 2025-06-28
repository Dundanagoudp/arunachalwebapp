export interface Testimonial {
  _id: string
  name: string
  about: string
  description: string
  image_url: string
  __v?: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}
