import apiClient from "@/apiClient"
import { ApiResponse } from "@/types/events-types"
import { Speaker, Event } from "@/types/speaker-types"

export async function addSpeaker(eventId: string, data: FormData): Promise<ApiResponse<Speaker>> {
  try {
    const response = await apiClient.post(`/speaker/addSpeaker/${eventId}`, data)
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

export async function getSpeaker(): Promise<ApiResponse<Speaker[]>> {
  try {
    const response = await apiClient.get("/speaker/getSpeaker")

    console.log("Raw API response:", response.data) // Debug log

    // Based on your API response structure: {"message": "Speaker found", "speaker": [...]}
    const speakersData = response.data.speaker

    // Ensure it's an array
    if (!Array.isArray(speakersData)) {
      console.error("Expected array but got:", typeof speakersData, speakersData)
      return {
        success: false,
        error: "Invalid response format - expected array of speakers",
      }
    }

    return {
      success: true,
      data: speakersData,
      message: response.data.message || "Speakers fetched successfully",
    }
  } catch (error: any) {
    console.error("getSpeaker error:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch speakers",
    }
  }
}

// Get single speaker by ID - using the getSpeaker endpoint and filtering
export async function getSpeakerById(speakerId: string): Promise<ApiResponse<Speaker>> {
  try {
    const response = await getSpeaker()

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || "Failed to fetch speakers",
      }
    }

    const speaker = response.data.find((s) => s._id === speakerId)

    if (!speaker) {
      return {
        success: false,
        error: "Speaker not found",
      }
    }

    return {
      success: true,
      data: speaker,
      message: "Speaker fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: "Failed to fetch speaker",
    }
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
      data: response.data.updatedSpeaker, // Fixed: using updatedSpeaker from your API response
      message: response.data.message || "Speaker updated successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update speaker",
    }
  }
}

// Event API functions
export async function getEvent(): Promise<ApiResponse<Event[]>> {
  try {
    const response = await apiClient.get("/event/getEvent")
    return {
      success: true,
      data: response.data,
      message: "Events fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch events",
    }
  }
}
