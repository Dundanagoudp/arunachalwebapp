import apiClient from "@/apiClient";
import type { ApiResponse, Blog, Category } from "@/types/newAndBlogTypes";

export async function addBlog(data: any): Promise<ApiResponse<Blog>> {
  try {
    const response = await apiClient.post("/newsAndBlog/addNewsAndBlog", data);
    if (!response.data || !response.data._id) {
      throw new Error("Invalid response format from server");
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    let errorMessage = "Failed to add blog";

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error("API Error:", error);
    return {
      success: false,
      message: errorMessage,
    };
  }
}

export async function getBlogs(): Promise<ApiResponse<Blog[]>> {
  try {
    const response = await apiClient.get("/newsAndBlog/getNewsAndBlog");
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    let errorMessage = "Failed to add blog";

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error("API Error:", error);
    return {
      success: false,
      message: errorMessage,
    };
  }
}
export async function updateBlogs(
  id: string,
   formData: FormData
): Promise<ApiResponse<Blog[]>> {
  try {
    const response = await apiClient.post(
      `newsAndBlog/updateNewsAndBlog/${id}`,
      formData
 
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    let errorMessage = "Failed to add blog";

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error("API Error:", error);
    return {
      success: false,
      message: errorMessage,
    };
  }
}

export async function getCategory(): Promise<ApiResponse<Category>> {
  try {
    const response = await apiClient.get(`newsAndBlog/getCategory`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    let errorMessage = "Failed to add blog";

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error("API Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch category",
    };
  }
}

export async function getBlogById(id: string): Promise<ApiResponse<Blog>> {
  try {
    const response = await apiClient.get(`/newsAndBlog/getNewsAndBlogById/${id}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    let errorMessage = "Failed to add blog";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    console.error("API Error:", error);
    return {
      success: false,

      error: error.response?.data?.message || "Failed to fetch blog",
    };
  }
}
export async function getBlogOnly(id: string): Promise<ApiResponse<Blog>> {
  try {
    const response = await apiClient.get(`/newsAndBlog/getBlogById/${id}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    let errorMessage = "Failed to get blog";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    console.error("API Error:", error);
    return {
      success: false,

      error: error.response?.data?.message || "Failed to fetch blog",
    };
  }

}

export async function deleteBlog(id: string): Promise<ApiResponse<Blog>> {
  try {
    const response = await apiClient.delete(`/newsAndBlog/deleteNewsAndBlog/${id}`);
    return {
      success: true,
      data: response.data,
      message: "Blog deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete blog",
    };
  }
}
