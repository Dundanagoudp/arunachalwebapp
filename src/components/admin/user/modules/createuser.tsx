"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { addUser } from "@/service/userServices"
import type { CreateUserData } from "@/types/user-types"
import { toast } from "sonner"

export default function CreateUser() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreateUserData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match")
        return
      }

      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters long")
        return
      }

      const response = await addUser(formData)

      if (response.success) {
        toast.success("User created successfully!")
        router.push("/admin/dashboard/users")
      } else {
        toast.error(response.error || "Failed to create user")
      }
    } catch (error) {
      toast.error("Failed to create user")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof CreateUserData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New User</h1>
          <p className="text-muted-foreground">Add a new user account to your platform.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Basic information about the new user.</CardDescription>
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
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Enter password..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Confirm password..."
                  required
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
                {loading ? "Creating..." : "Create User"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
