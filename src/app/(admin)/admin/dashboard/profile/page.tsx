"use client"

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
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getMyProfile, updateMyProfile } from "@/service/userServices"
import type { EditUserData, User } from "@/types/user-types"
import { toast } from "sonner"
import { getCookie } from "@/lib/cookies"
import ProtectedRoute from "@/components/auth/protected-route"
import { User as UserIcon, Edit, Save, X, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function UserProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetchingProfile, setFetchingProfile] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [formData, setFormData] = useState<EditUserData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  })

  useEffect(() => {
    const role = getCookie("userRole")
    setUserRole(role)
    
    // Redirect admin users to dashboard
    if (role === "admin") {
      router.push("/admin/dashboard")
      return
    }
    
    fetchProfile()
  }, [router])

  const fetchProfile = async () => {
    try {
      const response = await getMyProfile()
      if (response.success && response.data) {
        setFormData({
          name: response.data.name,
          email: response.data.email,
          password: "",
          confirmPassword: "",
          role: response.data.role,
        })
      } else {
        toast.error(response.error || "Failed to fetch profile")
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Failed to fetch profile details")
    } finally {
      setFetchingProfile(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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

      const response = await updateMyProfile(updateData)

      if (response.success) {
        toast.success("Profile updated successfully!")
        setIsEditing(false)
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }))
      } else {
        toast.error(response.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast.error("Failed to update profile")
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

  const handleCancelEdit = () => {
    setIsEditing(false)
    // Reset form data to current profile
    fetchProfile()
  }

  if (userRole === "admin") {
    return null
  }

  if (fetchingProfile) {
    return (
      <ProtectedRoute allowedRoles={["user"]}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                <p className="mt-4">Loading profile...</p>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>My Profile</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                <p className="text-muted-foreground">Manage your account information and settings.</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/admin/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>

            <div className="max-w-4xl">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <UserIcon className="h-5 w-5" />
                        Profile Information
                      </CardTitle>
                      <CardDescription>Your personal account details</CardDescription>
                    </div>
                    {!isEditing && (
                      <Button onClick={() => setIsEditing(true)} variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Enter full name..."
                          required
                          disabled={!isEditing}
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
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <>
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-medium mb-4">Change Password (Optional)</h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="password">New Password</Label>
                              <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                                placeholder="Enter new password..."
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword">Confirm New Password</Label>
                              <Input
                                id="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                placeholder="Confirm new password..."
                              />
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Leave password fields empty if you don't want to change your password.
                          </p>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button type="submit" disabled={loading}>
                            {loading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                              </>
                            )}
                          </Button>
                          <Button type="button" variant="outline" onClick={handleCancelEdit}>
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                        </div>
                      </>
                    )}

                    {!isEditing && (
                      <div className="grid gap-4 md:grid-cols-2 pt-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Account Status</Label>
                          <p className="text-sm text-green-600">Active</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
                          <p className="text-sm text-muted-foreground">Recently</p>
                        </div>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
} 