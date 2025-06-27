export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface Banner {
  _id: string
  image_url: string
  __v: number
}

export interface BannerText {
  _id: string
  bannerText: string
  bannerSubText: string
  location: string
  __v: number
}

export interface ButtonText {
  _id: string
  text: string
  link: string
  __v: number
}
