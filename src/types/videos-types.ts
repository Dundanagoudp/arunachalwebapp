
export interface VideoBlog {
  _id: string
  title: string
  videoType: "youtube" | "video"
  youtubeUrl?: string
  imageUrl?: string
  video_url?: string
  addedAt: string
  __v: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface AddVideoBlogData {
  title: string
  videoType: "youtube" | "video"
  youtubeUrl?: string
  video?: File
  thumbnail?: File
}

export interface UpdateVideoBlogData {
  title?: string
  videoType?: "youtube" | "video"
  youtubeUrl?: string
  video?: File
  thumbnail?: File
  addedAt?: string
}

