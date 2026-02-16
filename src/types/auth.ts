export type LoginRequest = {
  email: string;
  password: string;
  altchaPayload: string;
};

export type EncryptedLoginRequest = {
  encryptedBody: {
    content: string;
    iv: string;
  };
  dataEncrypted: 'true';
};

export type LoginResponse = {
  success: boolean;
  message: string;
}; 

export type LogoutResponse = {
  message: string;
  success: boolean;
};