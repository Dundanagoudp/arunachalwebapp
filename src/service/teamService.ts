import apiClient from "@/apiClient"
import type { ApiResponse, TeamMember } from "@/types/team-types"

export async function getTeamMembers(): Promise<ApiResponse<TeamMember[]>> {
  try {
    const response = await apiClient.get("/team/getTeamMembers")
    return {
      success: true,
      data: response.data.data || [],
      message: "Team members fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch team members",
    }
  }
}

export async function getTeamMemberById(id: string): Promise<ApiResponse<TeamMember>> {
  try {
    const response = await apiClient.get(`/team/getTeamMember/${id}`)
    return {
      success: true,
      data: response.data.data,
      message: "Team member fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch team member",
    }
  }
}

export async function addTeamMember(formData: FormData): Promise<ApiResponse<TeamMember>> {
  try {
    const response = await apiClient.post("/team/addTeamMember", formData)
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Team member added successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to add team member",
    }
  }
}

export async function updateTeamMember(id: string, formData: FormData): Promise<ApiResponse<TeamMember>> {
  try {
    const response = await apiClient.post(`/team/updateTeamMember/${id}`, formData)
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Team member updated successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update team member",
    }
  }
}

export async function deleteTeamMember(id: string): Promise<ApiResponse<TeamMember>> {
  try {
    const response = await apiClient.delete(`/team/deleteTeamMember/${id}`)
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Team member deleted successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete team member",
    }
  }
}
