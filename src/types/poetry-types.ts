export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface Poetry {
  _id: string
  text: string
  author: string
  __v: number
}
