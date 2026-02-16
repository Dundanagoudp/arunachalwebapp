import apiClient from "../apiClient";
import { LoginRequest, LoginResponse, LogoutResponse, EncryptedLoginRequest } from "../types/auth";
import { encryptPayload, isEncryptionAvailable } from "@/lib/encryption";

export async function generateCaptcha() {
  const response = await apiClient.get("/captcha/generate");
  return response.data;
}

/**
 * Login user with optional password encryption
 * 
 * @param data - Login credentials (email, password, altchaPayload)
 * @param useEncryption - Whether to encrypt the payload (default: true)
 * @returns Login response with success and message (JWT is in HttpOnly cookie)
 */
export async function loginUser(
  data: LoginRequest,
  useEncryption: boolean = true
): Promise<LoginResponse> {
  let requestBody: LoginRequest | EncryptedLoginRequest;
  
  // Check if encryption should be used and is available
  if (useEncryption && isEncryptionAvailable()) {
    try {
      // Encrypt the entire login payload
      const encryptedBody = encryptPayload(data);
      
      requestBody = {
        encryptedBody,
        dataEncrypted: 'true'
      };
      
      console.log('Login request encrypted successfully');
    } catch (error) {
      console.error('Encryption failed, falling back to plain request:', error);
      // Fallback to plain request if encryption fails
      requestBody = data;
    }
  } else {
    // Use plain request if encryption is disabled or unavailable
    if (useEncryption) {
      console.warn('Encryption requested but not available, using plain request');
    }
    requestBody = data;
  }
  
  const response = await apiClient.post("/onboarding/login", requestBody, {
    withCredentials: true,
  });
  
  return response.data;
} 

export async function logoutUser(data:LogoutResponse): Promise<void> {
  await apiClient.post("/onboarding/logout");
}
// adduser 
// authRoute.post("/addUser",protect,restrictTo("admin"),addUser);