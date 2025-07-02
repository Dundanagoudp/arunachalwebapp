import apiClient from "@/apiClient"
import { ApiResponse, Category } from "@/types/addCategory-types";

// addCategory
export async function addCategory(data: Category): Promise<ApiResponse<Category>> {
    try {
        const response = await apiClient.post(`/newsAndBlog/addCategory`, data);
        return {
            success: true,
            data: response.data,
            message: "Category added successfully",
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || "Failed to add category",
        };
    }
}

// getCategories
export async function getCategory(): Promise<ApiResponse<Category[]>> {
  try {
    const response = await apiClient.get(`/newsAndBlog/getCategory`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch categories",
    };
  }
}

// getCategoryById
export async function getCategoryById(id: string): Promise<ApiResponse<Category>> {
  try {
    const response = await apiClient.get(`/newsAndBlog/getCategoryById/${id}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch category",
    };
  }
}

// updateCategory
export async function updateCategory(id: string, data: Category): Promise<ApiResponse<Category>> {
  try {
    const response = await apiClient.put(`/newsAndBlog/updateCategory/${id}`, data);
    return {
      success: true,
      data: response.data,
      message: "Category updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update category",
    };
  }
}

// deleteCategory
export async function deleteCategory(id: string): Promise<ApiResponse<null>> {
  try {
    await apiClient.delete(`/newsAndBlog/deleteCategory/${id}`);
    return {
      success: true,
      message: "Category deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete category",
    };
  }
}
