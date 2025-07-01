export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface ContactMessage {
  _id: string
  name: string
  senderMail: string
  email: string
  phone: string
  message: string
  createdAt: string
  __v: number
  isReplied: boolean
}

export interface SenderMail {
  _id: string
  mail: string
  __v: number
}

// Contact Management Types
export interface ContactMessage {
  _id: string
  name: string
  senderMail: string
  email: string
  phone: string
  message: string
  createdAt: string
  __v: number
}

export interface SenderMail {
  _id: string
  mail: string
  __v: number
}