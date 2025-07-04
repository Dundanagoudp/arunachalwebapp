import apiClient from "@/apiClient"
import type { ApiResponse } from "@/types/home-types"

// addbanner
export async function addBanner(data: any): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.post("/homePage/addBanner", data)
    return {
      success: true,
      data: response.data.banner || response.data,
      message: response.data.message || "Banner added successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to add banner",
    }
  }
}

// getbanner
export async function getBanner(): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.get("/homePage/getBanner")
    return {
      success: true,
      data: response.data.banner || response.data,
      message: "Banner fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch banner",
    }
  }
}

// deletebanner
export async function deleteBanner(bannerId: string): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.delete(`/homePage/deleteBanner/${bannerId}`)
    return {
      success: true,
      data: response.data,
      message: response.data.message || "Banner deleted successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete banner",
    }
  }
}

// updatebanner
export async function updateBanner(bannerId: string, data: any): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.post(`/homePage/updateBanner/${bannerId}`, data)
    return {
      success: true,
      data: response.data.banner || response.data,
      message: response.data.message || "Banner updated successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update banner",
    }
  }
}

//addbannertext
export async function addText(data: any): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.post("/homePage/addBannerText", data)
    return {
      success: true,
      data: response.data.bannerText || response.data,
      message: response.data.message || "Banner text added successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to add banner text",
    }
  }
}

//getbannertext
export async function getText(): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.get("/homePage/getBannerText")
    return {
      success: true,
      data: response.data.bannerText || response.data,
      message: "Banner text fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch banner text",
    }
  }
}

// delete banner text
export async function deleteText(bannerId: string): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.delete(`/homePage/deleteBannerText/${bannerId}`)
    return {
      success: true,
      data: response.data,
      message: response.data.message || "Banner text deleted successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete banner text",
    }
  }
}

// update banner text
export async function updateText(bannerId: string, data: any): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.post(`/homePage/updateBannerText/${bannerId}`, data)
    return {
      success: true,
      data: response.data.bannerText || response.data,
      message: response.data.message || "Banner text updated successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update banner text",
    }
  }
}

// add button text
export async function addButtonText(data: any): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.post("/homePage/addButtonText", data)
    return {
      success: true,
      data: response.data.buttonText || response.data,
      message: response.data.message || "Button text added successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to add button text",
    }
  }
}

// getbutton text
export async function getButtonText(): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.get("/homePage/getButtonText")
    return {
      success: true,
      data: response.data.buttonText || response.data,
      message: "Button text fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch button text",
    }
  }
}

// delete button text
export async function deleteButtonText(bannerId: string): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.delete(`/homePage/deleteButtonText/${bannerId}`)
    return {
      success: true,
      data: response.data,
      message: response.data.message || "Button text deleted successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete button text",
    }
  }
}

// update button text
export async function updateButtonText(buttonId: string, data: any): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.post(`/homePage/updateButtonText/${buttonId}`, data)
    return {
      success: true,
      data: response.data.buttonText || response.data,
      message: response.data.message || "Button text updated successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update button text",
    }
  }
}
