import apiClient from "@/apiClient";
import { ApiResponse, ViewCounter } from "@/types/viewCounter-types";

export async function getCookies(): Promise<ApiResponse<ViewCounter[]>> {
  try {
    const response = await apiClient.get("/",{ withCredentials: true });
    return {
      success: true,
      data: response.data,
      message: "Cookies retrieved successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to retrieve cookies",
    };
  }
}

export  async function getCookieViewCount(): Promise<ApiResponse<ViewCounter[]>> {
  try {
    const response = await apiClient.get("/getView");
    return {
      success: true,
      data: response.data,
      message: "View count retrieved successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to retrieve view count",
    };
  }
}