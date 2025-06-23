import Cookies from "js-cookie"

export function getCookie(name: string): string | undefined {
  return Cookies.get(name)
}

export function getUserIdFromToken(): string | null {
  try {
    const token = getCookie("token")
    if (!token) {
      console.error("Authentication token not found")
      return null
    }

    const payloadBase64 = token.split(".")[1]
    if (!payloadBase64) {
      console.error("Invalid token format - missing payload")
      return null
    }

    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/")
    const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")
    const payloadJson = atob(paddedBase64)
    const payload = JSON.parse(payloadJson)

    console.log("Token payload for user ID:", payload) // Debug log

    // Assuming the user ID is stored in a field named 'id' in the JWT payload
    if (payload.id) {
      console.log("User ID extracted:", payload.id)
      return payload.id
    } else {
      console.error("User ID (id field) missing in token payload:", payload)
      return null
    }
  } catch (error) {
    console.error("Failed to parse authentication token for user ID:", error)
    return null
  }
}

export function getOrganizationFromToken(): string | null {
  try {
    const token = getCookie("token")
    if (!token) {
      console.error("Authentication token not found")
      return null
    }

    const payloadBase64 = token.split(".")[1]
    if (!payloadBase64) {
      console.error("Invalid token format - missing payload")
      return null
    }

    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/")
    const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")
    const payloadJson = atob(paddedBase64)
    const payload = JSON.parse(payloadJson)

    console.log("Token payload:", payload)

    if (!payload.organization) {
      console.error("Organization ID missing in token payload:", payload)
      return null
    }

    console.log("Organization ID extracted:", payload.organization)
    return payload.organization
  } catch (error) {
    console.error("Failed to parse authentication token:", error)
    return null
  }
}

export function getOrganizationNameFromToken(): string | null {
  try {
    const token = getCookie("token")
    if (!token) return null

    const payloadBase64 = token.split(".")[1]
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/")
    const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")
    const payloadJson = atob(paddedBase64)
    const payload = JSON.parse(payloadJson)

    return payload.organizationName || payload.organization_name || "Your Organization"
  } catch (error) {
    console.error("Failed to parse organization name from token:", error)
    return "Your Organization"
  }
}
