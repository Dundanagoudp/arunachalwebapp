import apiClient from "@/apiClient"
import type { ApiResponse, ScheduleDayPreview } from "@/types/scheduleDayPreview-types"

export async function getScheduleDayPreviews(): Promise<ApiResponse<ScheduleDayPreview[]>> {
  try {
    const response = await apiClient.get("/event/getScheduleDayPreviews")
    return {
      success: true,
      data: response.data.data || [],
      message: "Schedule days fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch schedule days",
    }
  }
}

export async function addScheduleDayPreview(data: {
  dayNumber: number
  label?: string
}): Promise<ApiResponse<ScheduleDayPreview>> {
  try {
    const response = await apiClient.post("/event/addScheduleDayPreview", data)
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Schedule day added successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to add schedule day",
    }
  }
}

export async function updateScheduleDayPreview(
  id: string,
  formData: FormData
): Promise<ApiResponse<ScheduleDayPreview>> {
  try {
    const response = await apiClient.post(`/event/updateScheduleDayPreview/${id}`, formData)
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Schedule day updated successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update schedule day",
    }
  }
}

export async function removeScheduleDayImage(
  id: string,
  imageUrl: string
): Promise<ApiResponse<ScheduleDayPreview>> {
  try {
    const response = await apiClient.post(`/event/removeScheduleDayImage/${id}`, { imageUrl })
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Image removed successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to remove image",
    }
  }
}

export async function reorderScheduleDayImages(
  id: string,
  images: string[]
): Promise<ApiResponse<ScheduleDayPreview>> {
  try {
    const response = await apiClient.post(`/event/reorderScheduleDayImages/${id}`, { images })
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Image order updated",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to reorder images",
    }
  }
}

export async function deleteScheduleDayPreview(id: string): Promise<ApiResponse<ScheduleDayPreview>> {
  try {
    const response = await apiClient.delete(`/event/deleteScheduleDayPreview/${id}`)
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Schedule day deleted successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete schedule day",
    }
  }
}
