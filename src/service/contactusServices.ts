import apiClient from "@/apiClient"
import { ApiResponse, ContactMessage, SenderMail } from "@/types/contactus-types"


// Get all contact messages
export async function getAllContactMessages(): Promise<ApiResponse<ContactMessage[]>> {
  try {
    const response = await apiClient.get('/sendMail/getAllContactMessages')
    return {
      success: true,
      data: response.data.data || [],
      message: response.data.message || "Contact messages retrieved successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to retrieve contact messages",
    }
  }
}

// Contact Us Mail
export async function contactUsMail(data: { 
  name: string
  email: string
  message: string
  phone?: string 
}): Promise<ApiResponse<ContactMessage>> {
  try {
    const response = await apiClient.post('/sendMail/contactUsMail', data)
    return {
      success: true,
      data: response.data.data?.contact,
      message: response.data.message || "Contact us mail sent successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to send contact us mail",
    }
  }
}

// Add sender mail
export async function addSenderMail(data: { mail: string }): Promise<ApiResponse<SenderMail>> {
  try {
    const response = await apiClient.post('/sendMail/addsenderMail', data)
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Sender mail added successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to add sender mail",
    }
  }
}

// Get all sender mails
export async function getAllSenderMail(): Promise<ApiResponse<SenderMail[]>> {
  try {
    const response = await apiClient.get('/sendMail/getSenderMail')
    return {
      success: true,
      data: response.data.data || [],
      message: "Sender mails retrieved successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to retrieve sender mails",
    }
  }
}

// Delete sender mail
export async function deleteSenderMail(mailId: string): Promise<ApiResponse<void>> {
  try {
    const response = await apiClient.delete(`/sendMail/deleteSenderMail/${mailId}`)
    return {
      success: true,
      message: response.data.message || "Sender mail deleted successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete sender mail",
    }
  }
}

// Update sender mail
export async function updateSenderMail(mailId: string, data: { mail: string }): Promise<ApiResponse<SenderMail>> {
  try {
    const response = await apiClient.post(`/sendMail/updateSenderMail/${mailId}`, data)
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Sender mail updated successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update sender mail",
    }
  }
}

// Delete contact message
export async function deleteContactMessage(id: string): Promise<ApiResponse<void>> {
  try {
    const response = await apiClient.delete(`/sendMail/deleteContactMessage/${id}`)
    return {
      success: true,
      message: response.data.message || "Contact message deleted successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete contact message",
    }
  }
}
