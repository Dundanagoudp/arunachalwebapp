"use client"

import { useState, useEffect } from "react"
import { getCookie } from "@/lib/cookies"

export function useDeletePermission() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const role = getCookie("userRole")
    setUserRole(role)
    setLoading(false)
  }, [])

  return {
    userRole,
    loading,
    isAdmin: userRole === "admin"
  }
} 