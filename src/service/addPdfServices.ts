import apiClient from "@/apiClient";
import { ApiResponse, PdfDocument } from "@/types/addPdf-types";

// Add PDF (Event Brochure)
export async function addPdf(formData: FormData): Promise<ApiResponse<PdfDocument>> {
  try {
    const response = await apiClient.post("/event/addPdf", formData);

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "PDF added successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to add PDF",
    };
  }
}

// Get PDFs (Event Brochures)
export async function getPdfs(): Promise<ApiResponse<PdfDocument[]>> {
  try {
    const response = await apiClient.get("/event/getEventBroucher");

    return {
      success: true,
      data: response.data,
      message: "PDFs fetched successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch PDFs",
    };
  }
}

// Update PDF (Event Brochure)
export async function updatePdf(pdfId: string, formData: FormData): Promise<ApiResponse<PdfDocument>> {
  try {
    const response = await apiClient.post(`/event/updateEventBroucher/${pdfId}`, formData);

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "PDF updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update PDF",
    };
  }
}

// Delete PDF (Event Brochure)
export async function deletePdf(pdfId: string): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.delete(`/event/deleteEventBroucher/${pdfId}`);

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "PDF deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete PDF",
    };
  }
}
