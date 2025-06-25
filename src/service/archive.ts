import apiClient from "@/apiClient"
import type { ApiResponse, ArchiveImage, ArchiveYear, ArchiveApiResponse, UploadResponse } from "@/types/archive-types"

// Year Management
export async function addYear(data: any): Promise<ApiResponse<ArchiveYear>> {
  try {
    const response = await apiClient.post("/archive/addyear", data)
    return {
      success: true,
      data: response.data,
      message: "Year added successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to add year",
    }
  }
}

export async function updateYear(yearId: string, data: any): Promise<ApiResponse<ArchiveYear>> {
  try {
    const response = await apiClient.post(`/archive/updateyear/${yearId}`, data)
    return {
      success: true,
      data: response.data,
      message: "Year updated successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update year",
    }
  }
}

export async function deleteYear(yearId: string): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.delete(`/archive/deleteyear/${yearId}`)
    return {
      success: true,
      data: response.data,
      message: "Year deleted successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete year",
    }
  }
}

// Image Management
export async function uploadImages(
  year_ref: string,
  dayNumber_ref: string,
  data: FormData,
): Promise<ApiResponse<UploadResponse>> {
  try {
    const response = await apiClient.post(`/archive/uploadImages/${year_ref}/year/${dayNumber_ref}`, data)
    return {
      success: true,
      data: response.data,
      message: "Images uploaded successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to upload images",
    }
  }
}

export async function getAllImages(): Promise<ApiResponse<ArchiveApiResponse>> {
  try {
    const response = await apiClient.get("/archive/getImages")
    return {
      success: true,
      data: response.data,
      message: "Images fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch images",
    }
  }
}

export async function getYearWiseImages(): Promise<ApiResponse<ArchiveApiResponse>> {
  try {
    const response = await apiClient.get("/archive/getImagesByYear")
    return {
      success: true,
      data: response.data,
      message: "Images fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch images",
    }
  }
}

export async function getYearDayWiseImages(): Promise<ApiResponse<ArchiveApiResponse>> {
  try {
    const response = await apiClient.get("/archive/getYearDayWiseImages")
    return {
      success: true,
      data: response.data,
      message: "Images fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch images",
    }
  }
}

export async function getImagesByYear(yearId: string): Promise<ApiResponse<ArchiveApiResponse>> {
  try {
    const response = await apiClient.get(`/archive/getYearImages/${yearId}`)
    return {
      success: true,
      data: response.data,
      message: "Images fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch images",
    }
  }
}

export async function updateUploadedImage(
  dayNumber_ref: string,
  year_ref: string,
  imageId: string,
  data: any,
): Promise<ApiResponse<ArchiveImage>> {
  try {
    const response = await apiClient.post(
      `/archive/updatedImages/${dayNumber_ref}/year/${year_ref}/image/${imageId}`,
      data,
    )
    return {
      success: true,
      data: response.data,
      message: "Image updated successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update image",
    }
  }
}

export async function deleteUploadedImage(imageId: string): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.delete(`/archive/deleteImages/image/${imageId}`)
    return {
      success: true,
      data: response.data,
      message: "Image deleted successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete image",
    }
  }
}

export async function deleteDay(day_ref: string): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.delete(`/archive/deleteday/${day_ref}`)
    return {
      success: true,
      data: response.data,
      message: "Day deleted successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete day",
    }
  }
}
