import axios from "axios"
import Cookies from "js-cookie"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

// Add request interceptors for authentication tokens
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Handle GET requests with body data
    if (config.method === "get" && config.data) {
      // For GET requests with data, we need to ensure the data is sent in the body
      config.headers["Content-Type"] = "application/json"

      // Log the request for debugging
      console.log("GET Request with body:", {
        url: config.url,
        data: config.data,
      })
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.data)
    return response
  },
  (error) => {
    console.error("API Error:", error)
    if (error.response) {
      console.error("Error response data:", error.response.data)
      console.error("Error response status:", error.response.status)
    }
    return Promise.reject(error)
  },
)

export default apiClient