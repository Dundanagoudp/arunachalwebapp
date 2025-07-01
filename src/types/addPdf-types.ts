export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PdfDocument {
  _id: string;
  pdf_url: string;
  __v: number;
}

export interface PdfFormData {
  pdf: File;
}
