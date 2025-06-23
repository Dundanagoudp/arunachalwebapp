import apiClient from "../apiClient";
import { LoginRequest, LoginResponse } from "../types/auth";

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post("/onboarding/login", data, {
    withCredentials: true,
  });
  return response.data;
} 