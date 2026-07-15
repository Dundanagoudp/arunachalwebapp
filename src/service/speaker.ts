import apiClient from "@/apiClient"
import { ApiResponse } from "@/types/events-types"
import type {
  Speaker,
  SpeakerYear,
  SpeakerYearWithSpeakers,
  GroupedSpeakersResponse,
  CreateSpeakerYearPayload,
  UpdateSpeakerYearPayload,
} from "@/types/speaker-types"

export async function getSpeakerYears(): Promise<ApiResponse<SpeakerYear[]>> {
  try {
    const response = await apiClient.get("/speaker/getYears")
    const years = response.data.years
    if (!Array.isArray(years)) {
      return { success: false, error: "Invalid response format - expected array of years" }
    }
    return {
      success: true,
      data: years,
      message: response.data.message || "Years fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch speaker years",
    }
  }
}

export async function getSpeakersGrouped(): Promise<ApiResponse<GroupedSpeakersResponse>> {
  try {
    const response = await apiClient.get("/speaker/getSpeaker")
    const years = response.data.years
    if (!Array.isArray(years)) {
      return { success: false, error: "Invalid response format - expected grouped years" }
    }
    return {
      success: true,
      data: { years },
      message: response.data.message || "Speakers fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch speakers",
    }
  }
}

export async function getSpeakersByYear(yearId: string): Promise<ApiResponse<SpeakerYearWithSpeakers>> {
  try {
    const response = await apiClient.get(`/speaker/getSpeaker/${yearId}`)
    return {
      success: true,
      data: response.data,
      message: response.data.message || "Speakers fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch speakers for year",
    }
  }
}

export async function createSpeakerYear(
  data: CreateSpeakerYearPayload,
): Promise<ApiResponse<SpeakerYear>> {
  try {
    const response = await apiClient.post("/speaker/addYear", data)
    return {
      success: true,
      data: response.data.year ?? response.data,
      message: response.data.message || "Year created successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create speaker year",
    }
  }
}

export async function updateSpeakerYear(
  yearId: string,
  data: UpdateSpeakerYearPayload,
): Promise<ApiResponse<SpeakerYear>> {
  try {
    const response = await apiClient.post(`/speaker/updateYear/${yearId}`, data)
    return {
      success: true,
      data: response.data.year ?? response.data,
      message: response.data.message || "Year updated successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update speaker year",
    }
  }
}

export async function deleteSpeakerYear(yearId: string): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.delete(`/speaker/deleteYear/${yearId}`)
    return {
      success: true,
      data: response.data,
      message: response.data.message || "Year deleted successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete speaker year",
    }
  }
}

export async function addSpeaker(yearId: string, data: FormData): Promise<ApiResponse<Speaker>> {
  try {
    const response = await apiClient.post(`/speaker/addSpeaker/${yearId}`, data)
    return {
      success: true,
      data: response.data.speaker,
      message: response.data.message || "Speaker added successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to add speaker",
    }
  }
}

export async function getSpeakerById(speakerId: string): Promise<ApiResponse<Speaker>> {
  try {
    const response = await getSpeakersGrouped()
    if (!response.success || !response.data) {
      return { success: false, error: response.error || "Failed to fetch speakers" }
    }

    const allSpeakers = response.data.years.flatMap((y) => y.speakers)
    const speaker = allSpeakers.find((s) => s._id === speakerId)

    if (!speaker) {
      return { success: false, error: "Speaker not found" }
    }

    return { success: true, data: speaker, message: "Speaker fetched successfully" }
  } catch {
    return { success: false, error: "Failed to fetch speaker" }
  }
}

export async function deleteSpeaker(speakerId: string): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.delete(`/speaker/deleteSpeaker/${speakerId}`)
    return {
      success: true,
      data: response.data,
      message: "Speaker deleted successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete speaker",
    }
  }
}

export async function updateSpeaker(speakerId: string, data: FormData): Promise<ApiResponse<Speaker>> {
  try {
    const response = await apiClient.post(`/speaker/updateSpeaker/${speakerId}`, data)
    return {
      success: true,
      data: response.data.updatedSpeaker,
      message: response.data.message || "Speaker updated successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update speaker",
    }
  }
}
