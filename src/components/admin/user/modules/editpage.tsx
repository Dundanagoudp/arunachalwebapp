"use client"

import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { editUser, getAllUsers, getMyProfile } from "@/service/userServices"
import type { EditUserData, User } from "@/types/user-types"
import { toast } from "sonner"
import Cookies from "js-cookie"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function EditUser() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  const [loading, setLoading] = useState(false)
  const [fetchingUser, setFetchingUser] = useState(true)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showPasswordWarning, setShowPasswordWarning] = useState(false)
  const [isOwnAccount, setIsOwnAccount] = useState(false)
  const [formData, setFormData] = useState<EditUserData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  })

  useEffect(() => {
    fetchCurrentUser()
    fetchUser()
  }, [userId])

  const fetchCurrentUser = async () => {
    try {
      const response = await getMyProfile()
      if (response.success && response.data) {
        setCurrentUser(response.data)
        // Check if editing own account
        setIsOwnAccount(response.data._id === userId)
      }
    } catch (error) {
      console.error("Failed to fetch current user:", error)
    }
  }

  const fetchUser = async () => {
    try {
      const response = await getAllUsers()
      if (response.success && response.data) {
        const user = response.data.find((u: User) => u._id === userId)
        if (user) {
          setFormData({
            name: user.name,
            email: user.email,
            password: "",
            confirmPassword: "",
            role: user.role,
          })
        } else {
          toast.error("User not found")
          router.push("/admin/dashboard/users")
        }
      }
    } catch (error) {
      toast.error("Failed to fetch user details")
    } finally {
      setFetchingUser(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // If password is being changed on own account, show warning dialog
    if (formData.password && isOwnAccount) {
      setShowPasswordWarning(true)
      return
    }
    
    // Otherwise proceed with update
    await performUpdate()
  }

  const performUpdate = async () => {
    setLoading(true)

    try {
      // If password is provided, validate it
      if (formData.password && formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match")
        return
      }

      if (formData.password && formData.password.length < 6) {
        toast.error("Password must be at least 6 characters long")
        return
      }

      const updateData: EditUserData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      }

      // Only include password if it's provided
      if (formData.password) {
        updateData.password = formData.password
        updateData.confirmPassword = formData.confirmPassword
      }

      const response = await editUser(userId, updateData)

      if (response.success) {
        toast.success("User updated successfully!")
        
        // If user changed their own password, clear session and redirect to login
        if (formData.password && isOwnAccount) {
          // Clear all cookies
          Cookies.remove("userRole", { path: "/" })
          Cookies.remove("token", { path: "/" })
          
          // Clear session storage
          sessionStorage.clear()
          
          toast.info("Password changed. Please login again with your new password.")
          
          // Redirect to login page after a short delay
          setTimeout(() => {
            router.push("/login")
          }, 1500)
        } else {
          router.push("/admin/dashboard/users")
        }
      } else {
        toast.error(response.error || "Failed to update user")
      }
    } catch (error) {
      toast.error("Failed to update user")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof EditUserData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (fetchingUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4">Loading user details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
          <p className="text-muted-foreground">Update user account information.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Update the user's basic information and role.</CardDescription>
            {isOwnAccount && (
              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm text-amber-800">
                  ⚠️ You are editing your own account. Changing your password will require you to log in again.
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter full name..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="user@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">New Password (Optional)</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Leave blank to keep current password"
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">User Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: "admin" | "user") => handleInputChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update User"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Password Change Warning Dialog */}
      <AlertDialog open={showPasswordWarning} onOpenChange={setShowPasswordWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Password Change Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to change your own password. After this change, you will be logged out and need to log in again with your new password.
              <br /><br />
              Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowPasswordWarning(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setShowPasswordWarning(false)
              performUpdate()
            }}>
              Yes, Change Password
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
