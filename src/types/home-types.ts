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
  link: string
  __v: number
}

export interface ButtonText {
  _id: string
  text: string
  link: string
  __v: number
}

// Intro types
export interface IntroItem {
  _id: string
  title: string
  description: string
  date: string
  image_url: string
  __v?: number
}

export type IntroList = IntroItem[]

// Contact Information types
export interface ContactInfo {
  _id: string
  officeAddress: string
  eventVenue: string
  email: string
  emailLink: string
  __v?: number
}

export interface AddContactInfoRequest {
  officeAddress: string
  eventVenue: string
  email: string
  emailLink: string
}

export interface UpdateContactInfoRequest {
  officeAddress?: string
  eventVenue?: string
  email?: string
  emailLink?: string
}

export type ContactInfoList = ContactInfo[]
