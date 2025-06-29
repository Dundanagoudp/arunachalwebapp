export interface Workshop {
  _id: string;
  eventRef: string;
  name: string;
  about: string;
  imageUrl: string;
  registrationFormUrl: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateWorkshopData {
  eventRef: string;
  name: string;
  about: string;
  imageUrl: string;
  registrationFormUrl: string;
}

export interface UpdateWorkshopData {
  name?: string;
  about?: string;
  imageUrl?: string;
  registrationFormUrl?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
