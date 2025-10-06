/**
 * Utility functions for handling media URLs
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
// Extract the base URL without /api/v1 for media files
const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 
  (API_BASE_URL ? API_BASE_URL.replace('/api/v1', '') : "https://litfest.arunachal.gov.in/api/v1".replace('/api/v1', ''))

// Do not throw at import time; warn and fall back to localhost for DX
if (!API_BASE_URL && typeof window !== 'undefined') {
  // Only warn in the browser to reduce noise in server logs
  console.warn("mediaUrl: NEXT_PUBLIC_API_BASE_URL is not set. Falling back to http://localhost:8000 for media URLs.")
}

/**
 * Convert a relative media URL to a full URL
 * @param relativePath - The relative path from the backend (e.g., "/uploads/VideoBlog/thumbnails/123.jpg")
 * @returns Full URL or fallback placeholder
 */
export function getMediaUrl(relativePath: string | null | undefined): string {
  if (!relativePath) {
    return "/placeholder.svg"
  }

  // If it's already a full URL (like YouTube thumbnails), return as is
  if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
    return relativePath
  }

  // For media files (uploads), use MEDIA_BASE_URL instead of API_BASE_URL
  // because uploads are served directly from the server root, not from /api/v1
  const fullUrl = relativePath.startsWith("/") 
    ? `${MEDIA_BASE_URL}${relativePath}`
    : `${MEDIA_BASE_URL}/${relativePath}`
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Media URL:', { relativePath, MEDIA_BASE_URL, fullUrl })
  }
  
  return fullUrl
}

/**
 * Get video URL with API base URL
 * @param videoUrl - The video URL from backend
 * @returns Full video URL
 */
export function getVideoUrl(videoUrl: string | null | undefined): string {
  return getMediaUrl(videoUrl)
}

/**
 * Get thumbnail URL with API base URL
 * @param thumbnailUrl - The thumbnail URL from backend
 * @returns Full thumbnail URL
 */
export function getThumbnailUrl(thumbnailUrl: string | null | undefined): string {
  return getMediaUrl(thumbnailUrl)
}

/**
 * Check if a URL is a YouTube URL
 * @param url - URL to check
 * @returns boolean
 */
export function isYouTubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be")
}
