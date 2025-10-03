import apiClient from "@/apiClient"
import type { ApiResponse, VideoBlog, AddVideoBlogData, UpdateVideoBlogData } from "@/types/videos-types"

// Add video blog (supports both YouTube URL and file upload)
export async function addVideoBlog(data: AddVideoBlogData): Promise<ApiResponse<VideoBlog>> {
  try {
    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("videoType", data.videoType)

    if (data.videoType === "youtube" && data.youtubeUrl) {
      formData.append("youtubeUrl", data.youtubeUrl)
    }

    if (data.videoType === "video") {
      if (data.video) {
        formData.append("video", data.video)
      }
      if (data.thumbnail) {
        formData.append("thumbnail", data.thumbnail)
      }
    }

    const response = await apiClient.post("/videoBlog/addVideoBlog", formData)
    return {
      success: true,
      data: response.data.videoBlog || response.data,
      message: response.data.message || "Video blog added successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to add video blog",
    }
  }
}

// Get all video blogs
export async function getVideoBlog(): Promise<ApiResponse<VideoBlog[]>> {
  try {
    const response = await apiClient.get("/videoBlog/getVideoBlog")
    return {
      success: true,
      data: response.data,
      message: "Video blogs fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch video blogs",
    }
  }
}

// Get raw videos only
export async function getRawVideos(): Promise<ApiResponse<VideoBlog[]>> {
  try {
    const response = await apiClient.get("/videoBlog/getRawVideo")
    return {
      success: true,
      data: response.data,
      message: "Raw videos fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch raw videos",
    }
  }
}

// Get YouTube videos only
export async function getYoutubeVideos(): Promise<ApiResponse<VideoBlog[]>> {
  try {
    const response = await apiClient.get("/videoBlog/getYoutubeVideo")
    return {
      success: true,
      data: response.data,
      message: "YouTube videos fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch YouTube videos",
    }
  }
}

// Get raw video by ID
export async function getRawVideoById(videoId: string): Promise<ApiResponse<VideoBlog>> {
  try {
    const response = await apiClient.get(`/videoBlog/getRawVideoById/${videoId}`)
    return {
      success: true,
      data: response.data,
      message: "Raw video fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch raw video",
    }
  }
}

// Get video by ID
export async function getVideoById(videoId: string): Promise<ApiResponse<VideoBlog>> {
  try {
    const response = await apiClient.get(`/videoBlog/getVideoById/${videoId}`)
    return {
      success: true,
      data: response.data,
      message: "Video fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch video",
    }
  }
}

// Update video blog
export async function updateVideoBlog(videoId: string, data: UpdateVideoBlogData): Promise<ApiResponse<VideoBlog>> {
  try {
    const formData = new FormData()

    if (data.title) formData.append("title", data.title)
    if (data.videoType) formData.append("videoType", data.videoType)
    if (data.addedAt) formData.append("addedAt", data.addedAt)

    if (data.videoType === "youtube" && data.youtubeUrl) {
      formData.append("youtubeUrl", data.youtubeUrl)
    }

    if (data.videoType === "video") {
      if (data.video) {
        formData.append("video", data.video)
      }
      if (data.thumbnail) {
        formData.append("thumbnail", data.thumbnail)
      }
    }

    const response = await apiClient.post(`/videoBlog/updateVideo/${videoId}`, formData)
    return {
      success: true,
      data: response.data.videoBlog || response.data,
      message: response.data.message || "Video blog updated successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update video blog",
    }
  }
}

// Delete video blog
export async function deleteVideoBlog(videoId: string): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.delete(`/videoBlog/deleteVideo/${videoId}`)
    return {
      success: true,
      data: response.data,
      message: response.data.message || "Video blog deleted successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete video blog",
    }
  }
}
