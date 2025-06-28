import apiClient from "@/apiClient"
import type { ApiResponse, Testimonial } from "@/types/testimonial-types"

// add testimonial
export async function addTestimonial(data: FormData): Promise<ApiResponse<Testimonial>> {
  try {
    const response = await apiClient.post("/homePage/addTestimonial", data)
    return {
      success: true,
      data: response.data.testimonial || response.data,
      message: response.data.message || "Testimonial added successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to add testimonial",
    }
  }
}

// get testimonials
export async function getTestimonials(): Promise<ApiResponse<Testimonial[]>> {
  try {
    const response = await apiClient.get("/homePage/getTestimonial")
    return {
      success: true,
      data: response.data.testimonial || response.data,
      message: response.data.message || "Testimonials fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch testimonials",
    }
  }
}

// update testimonial
export async function updateTestimonial(testimonyId: string, data: FormData): Promise<ApiResponse<Testimonial>> {
  try {
    const response = await apiClient.post(`/homePage/updateTestimonial/${testimonyId}`, data)
    return {
      success: true,
      data: response.data.testimonial || response.data,
      message: response.data.message || "Testimonial updated successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update testimonial",
    }
  }
}

// delete testimonial
export async function deleteTestimonial(testimonialId: string): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.delete(`/homePage/deleteTestimonial/${testimonialId}`)
    return {
      success: true,
      data: response.data.testimonial || response.data,
      message: response.data.message || "Testimonial deleted successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete testimonial",
    }
  }
}
