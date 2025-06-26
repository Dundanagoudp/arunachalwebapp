export interface ArchiveYear {
  _id: string
  year: number
  month: number
  totalDays?: number
  days?: ArchiveDay[]
  createdAt?: string
  updatedAt?: string
}

export interface ArchiveDay {
  _id: string
  year_ref?: string | ArchiveYear
  dayLabel: string
  dayNumber?: number
  createdAt?: string
  updatedAt?: string
}

export interface ArchiveImage {
  _id: string
  year_ref: ArchiveYear
  dayNumber_ref: ArchiveDay
  image_url: string
  originalName?: string
  fileSize?: number
  mimeType?: string
  createdAt: string
  updatedAt: string
}

export interface ArchiveStats {
  totalYears: number
  totalDays: number
  totalImages: number
  latestYear: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface ArchiveApiResponse {
  archive: ArchiveImage[]
  totalCount?: number
  page?: number
  limit?: number
}

export interface YearApiResponse {
  years: ArchiveYear[]
}

export interface UploadResponse {
  uploadedImages: ArchiveImage[]
  successCount: number
  failedCount: number
  errors?: string[]
}

export interface FilterOptions {
  searchTerm: string
  yearFilter: string
  dayFilter: string
  dateRange?: {
    start: Date
    end: Date
  }
}

export interface ViewMode {
  type: "grid" | "list"
  itemsPerPage: number
}

export interface BulkOperationResult {
  successCount: number
  failedCount: number
  errors: string[]
  processedIds: string[]
}
