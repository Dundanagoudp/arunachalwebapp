import apiClient from "@/apiClient"
import type { ApiResponse } from "@/types/poetry-types"

// Add poetry
export async function addPoetry(data: any): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.post("/homePage/addPoetry", data)
    return {
      success: true,
      data: response.data.poetry || response.data,
      message: response.data.message || "Poetry added successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to add poetry",
    }
  }
}

// Update poetry
export async function updatePoetry(poetryId: string, data: any): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.post(`/homePage/updatePoetry/${poetryId}`, data)
    return {
      success: true,
      data: response.data.poetry || response.data,
      message: response.data.message || "Poetry updated successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update poetry",
    }
  }
}

// Get poetry
export async function getPoetry(): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.get("/homePage/getPoetry")
    return {
      success: true,
      data: response.data.poetry || response.data,
      message: response.data.message || "Poetry fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch poetry",
    }
  }
}

// Delete poetry
export async function deletePoetry(poetryId: string): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.delete(`/homePage/deletePoetry/${poetryId}`)
    return {
      success: true,
      data: response.data.poetry || response.data,
      message: response.data.message || "Poetry deleted successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete poetry",
    }
  }
}
