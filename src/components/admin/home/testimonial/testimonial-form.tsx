"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, X } from "lucide-react"
import type { Testimonial } from "@/types/testimonial-types"
import { getMediaUrl } from "@/utils/mediaUrl"

interface TestimonialFormProps {
  testimonial?: Testimonial
  onSubmit: (formData: FormData) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

export function TestimonialForm({ testimonial, onSubmit, onCancel, isLoading }: TestimonialFormProps) {
  const [formData, setFormData] = useState({
    name: testimonial?.name || "",
    about: testimonial?.about || "",
    description: testimonial?.description || "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(testimonial?.image_url || "")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        console.log('Image preview:', reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const submitData = new FormData()
    submitData.append("name", formData.name)
    submitData.append("about", formData.about)
    submitData.append("description", formData.description)

    if (imageFile) {
      submitData.append("image_url", imageFile)
    }

    await onSubmit(submitData)
    console.log('Submit data:', submitData)
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview("")
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{testimonial ? "Edit Testimonial" : "Add New Testimonial"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Profile Image</Label>
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={getMediaUrl(imagePreview)} alt="Preview" />
                <AvatarFallback>
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                  suppressHydrationWarning
                />
                {imagePreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeImage}
                    className="mt-2 bg-transparent"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove Image
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Testimonial Text</Label>
            <Textarea
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter the testimonial text..."
              required
              rows={3}
              suppressHydrationWarning
            />
          </div>

          {/* About Field */}
          <div className="space-y-2">
            <Label htmlFor="about">Customer Name</Label>
            <Input
              id="about"
              name="about"
              value={formData.about}
              onChange={handleInputChange}
              placeholder="Enter customer name"
              required
              suppressHydrationWarning
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Customer Title/Role</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="e.g., Verified Customer, CEO, etc."
              required
              suppressHydrationWarning
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : testimonial ? "Update Testimonial" : "Add Testimonial"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
