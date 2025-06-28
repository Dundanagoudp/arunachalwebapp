import apiClient from "@/apiClient"
import type { Workshop, CreateWorkshopData, UpdateWorkshopData, ApiResponse } from "@/types/workshop-types"
import type { Event } from "@/types/events-types"

// Add workshop with better error handling
export async function addWorkshop(eventId: string, data: CreateWorkshopData): Promise<ApiResponse<Workshop>> {
  try {
    console.log("Adding workshop with data:", { eventId, data })

    // Validate required fields
    if (!eventId) {
      return {
        success: false,
        error: "Event ID is required",
      }
    }

    if (!data.name || !data.about) {
      return {
        success: false,
        error: "Workshop name and description are required",
      }
    }

    // Check if image is provided (either as base64 data or URL)
    if (!data.imageUrl) {
      return {
        success: false,
        error: "An image is required",
      }
    }

    // Backend requires Google Forms URL
    if (!data.registrationFormUrl || !data.registrationFormUrl.startsWith('https://docs.google.com/forms/')) {
      return {
        success: false,
        error: "A valid Google Forms URL is required (must start with https://docs.google.com/forms/)",
      }
    }

    // Prepare form data for file upload
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("about", data.about)
    formData.append("registrationFormUrl", data.registrationFormUrl)

    // Handle image upload if provided as base64
    if (data.imageUrl && data.imageUrl.startsWith('data:')) {
      // Convert base64 to file
      const response = await fetch(data.imageUrl)
      const blob = await response.blob()
      const file = new File([blob], 'workshop-image.jpg', { type: blob.type })
      formData.append("imageUrl", file)
    } else if (data.imageUrl && data.imageUrl.startsWith('http')) {
      // If it's a URL, we need to provide a placeholder since backend expects file upload
      // For now, we'll require file upload
      return {
        success: false,
        error: "Please upload an image file (URLs are not supported by the backend)",
      }
    } else {
      return {
        success: false,
        error: "Please upload a valid image file",
      }
    }

    const response = await apiClient.post(`/registration/addRegistration/${eventId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log("Workshop creation response:", response.data)

    return {
      success: true,
      data: response.data,
      message: "Workshop added successfully",
    }
  } catch (error: any) {
    console.error("Error adding workshop:", error)

    let errorMessage = "Failed to add workshop"

    if (error.response) {
      console.error("Error response:", error.response.data)
      console.error("Error status:", error.response.status)

      // Handle specific error cases
      if (error.response.status === 400) {
        errorMessage = error.response.data?.message || "Invalid data provided"
      } else if (error.response.status === 401) {
        errorMessage = "Authentication required"
      } else if (error.response.status === 403) {
        errorMessage = "Permission denied"
      } else if (error.response.status === 404) {
        errorMessage = "Event not found"
      } else if (error.response.status === 500) {
        errorMessage =
          error.response.data?.message || "Server error occurred. Please check if the event exists and try again."
      } else {
        errorMessage = error.response.data?.message || errorMessage
      }
    } else if (error.request) {
      errorMessage = "Network error - please check your connection"
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

// Get all workshops
export async function getWorkshops(): Promise<ApiResponse<Workshop[]>> {
  try {
    const response = await apiClient.get("/registration/getRegistration")
    console.log("Get workshops response:", response.data)

    return {
      success: true,
      data: Array.isArray(response.data) ? response.data : [],
      message: "Workshops fetched successfully",
    }
  } catch (error: any) {
    console.error("Error fetching workshops:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch workshops",
    }
  }
}

// Update workshop
export async function updateWorkshop(workshopId: string, data: UpdateWorkshopData): Promise<ApiResponse<Workshop>> {
  try {
    // Prepare form data for file upload
    const formData = new FormData()
    
    if (data.name) formData.append("name", data.name)
    if (data.about) formData.append("about", data.about)
    if (data.registrationFormUrl) formData.append("registrationFormUrl", data.registrationFormUrl)

    // Handle image upload if provided
    if (data.imageUrl && data.imageUrl.startsWith('data:')) {
      // Convert base64 to file
      const response = await fetch(data.imageUrl)
      const blob = await response.blob()
      const file = new File([blob], 'workshop-image.jpg', { type: blob.type })
      formData.append("imageUrl", file)
    }

    const response = await apiClient.post(`/registration/updateRegistration/${workshopId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    console.log("Update workshop response:", response.data)

    return {
      success: true,
      data: response.data.updatedworkshop || response.data,
      message: response.data.message || "Workshop updated successfully",
    }
  } catch (error: any) {
    console.error("Error updating workshop:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update workshop",
    }
  }
}

// Delete workshop
export async function deleteWorkshop(workshopId: string): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.delete(`/registration/deleteRegistration/${workshopId}`)
    return {
      success: true,
      data: response.data,
      message: response.data.message || "Workshop deleted successfully",
    }
  } catch (error: any) {
    console.error("Error deleting workshop:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete workshop",
    }
  }
}

// Get events
export async function getEvents(): Promise<ApiResponse<Event[]>> {
  try {
    const response = await apiClient.get("/event/getEvent")
    console.log("Get events response:", response.data)

    return {
      success: true,
      data: Array.isArray(response.data) ? response.data : [],
      message: "Events fetched successfully",
    }
  } catch (error: any) {
    console.error("Error fetching events:", error)
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch events",
    }
  }
}
