import apiClient from "../apiClient";
import { LoginRequest, LoginResponse, LogoutResponse } from "../types/auth";

export async function generateCaptcha() {
  const response = await apiClient.get("/captcha/generate");
  return response.data;
}

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post("/onboarding/login", data, {
    withCredentials: true,
  });
  return response.data;
} 

export async function logoutUser(data:LogoutResponse): Promise<void> {
  await apiClient.post("/onboarding/logout");
}
// adduser 
// authRoute.post("/addUser",protect,restrictTo("admin"),addUser);