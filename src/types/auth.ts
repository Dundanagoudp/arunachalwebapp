export type LoginRequest = {
  email: string;
  password: string;
  altchaPayload: string;
};

export type LoginResponse = {
  message: string;
  token: string;
  data: {
    user: {
      role: string;
      accountType?: string;
      // Add other user fields as needed
    };
  };
}; 

export type LogoutResponse = {
  message: string;
  success: boolean;
};