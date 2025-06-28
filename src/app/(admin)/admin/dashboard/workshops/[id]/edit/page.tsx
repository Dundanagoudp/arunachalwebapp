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
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, Save, ArrowLeft, Upload, Loader2, X } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { updateWorkshop, getWorkshops, getEvents } from "@/service/registrationService"
import type { Workshop, UpdateWorkshopData } from "@/types/workshop-types"
import type { Event } from "@/types/events-types"
import { useToast } from "@/hooks/use-toast"

export default function EditWorkshop() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<UpdateWorkshopData>({
    name: "",
    about: "",
    imageUrl: "",
    registrationFormUrl: "",
  })
  const [uploadedImage, setUploadedImage] = useState<string>("")

  useEffect(() => {
    fetchData()
  }, [params.id])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [workshopsResponse, eventsResponse] = await Promise.all([getWorkshops(), getEvents()])

      if (workshopsResponse.success && workshopsResponse.data) {
        const foundWorkshop = workshopsResponse.data.find((w) => w._id === params.id)
        if (foundWorkshop) {
          setWorkshop(foundWorkshop)
          setFormData({
            name: foundWorkshop.name,
            about: foundWorkshop.about,
            imageUrl: foundWorkshop.imageUrl,
            registrationFormUrl: foundWorkshop.registrationFormUrl,
          })
        } else {
          toast({
            title: "Error",
            description: "Workshop not found",
          })
          router.push("/admin/dashboard/workshops")
        }
      }

      if (eventsResponse.success && eventsResponse.data) {
        setEvents(eventsResponse.data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch workshop",
      })
    } finally {
      setLoading(false)
    }
  }

  const getEventName = (eventRef: string) => {
    const event = events.find((e) => e._id === eventRef)
    return event?.name || eventRef
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Please select a valid image file",
        })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
        setFormData((prev) => ({ ...prev, imageUrl: "" }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setUploadedImage("")
    setFormData((prev) => ({ ...prev, imageUrl: "" }))
  }

  const validateForm = () => {
    if (!formData.name?.trim()) {
      toast({
        title: "Validation Error",
        description: "Workshop name is required",
      })
      return false
    }

    if (!formData.about?.trim()) {
      toast({
        title: "Validation Error",
        description: "Workshop description is required",
      })
      return false
    }

    // Backend requires Google Forms URL
    if (!formData.registrationFormUrl?.trim() || !formData.registrationFormUrl.startsWith('https://docs.google.com/forms/')) {
      toast({
        title: "Validation Error",
        description: "A valid Google Forms URL is required (must start with https://docs.google.com/forms/)",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!workshop) return

    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    try {
      const updateData: UpdateWorkshopData = {
        name: formData.name?.trim() || "",
        about: formData.about?.trim() || "",
        registrationFormUrl: formData.registrationFormUrl?.trim() || "",
      }

      // Only include image if a new one is uploaded
      if (uploadedImage) {
        updateData.imageUrl = uploadedImage
      }

      const response = await updateWorkshop(workshop._id, updateData)
      if (response.success) {
        toast({
          title: "Success",
          description: "Workshop updated successfully",
        })
        router.push("/admin/dashboard/workshops")
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update workshop",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update workshop",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (!workshop) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Workshop not found</h2>
              <Button asChild className="mt-4" suppressHydrationWarning={true}>
                <Link href="/admin/dashboard/workshops">Back to Workshops</Link>
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
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
                  <BreadcrumbLink href="/admin/dashboard">Admin Panel</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/dashboard/workshops">Workshops</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Edit Workshop</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6 pt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Edit Workshop</h1>
              <p className="text-muted-foreground text-sm md:text-base">Update workshop information.</p>
            </div>
            <Button variant="outline" asChild className="w-full sm:w-auto bg-transparent" suppressHydrationWarning={true}>
              <Link href="/admin/dashboard/workshops">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Workshops
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Workshop Details
              </CardTitle>
              <CardDescription>Update the information for this workshop.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Workshop Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter workshop name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      suppressHydrationWarning={true}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Associated Event</Label>
                    <Input value={getEventName(workshop.eventRef)} disabled className="bg-muted" suppressHydrationWarning={true} />
                    <p className="text-xs text-muted-foreground">Event association cannot be changed</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about">About Workshop *</Label>
                  <Textarea
                    id="about"
                    name="about"
                    placeholder="Enter workshop description and details"
                    value={formData.about}
                    onChange={handleChange}
                    rows={6}
                    required
                    suppressHydrationWarning={true}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationFormUrl">Registration Form URL *</Label>
                  <Input
                    id="registrationFormUrl"
                    name="registrationFormUrl"
                    type="url"
                    placeholder="https://docs.google.com/forms/..."
                    value={formData.registrationFormUrl}
                    onChange={handleChange}
                    required
                    suppressHydrationWarning={true}
                  />
                  <p className="text-xs text-muted-foreground">Must be a valid Google Forms URL</p>
                </div>

                <div className="space-y-4">
                  <Label>Workshop Image</Label>
                  <p className="text-xs text-muted-foreground">Upload a new image to replace the current one</p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Upload New Image</Label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="file"
                          id="imageFile"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          suppressHydrationWarning={true}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full sm:w-auto bg-transparent"
                          onClick={() => document.getElementById("imageFile")?.click()}
                          suppressHydrationWarning={true}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Choose New Image
                        </Button>
                        <p className="text-xs text-muted-foreground self-center">
                          Max size: 5MB. Supported: JPG, PNG, GIF
                        </p>
                      </div>
                    </div>

                    {/* Image Preview */}
                    {(uploadedImage || formData.imageUrl) && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Image Preview</Label>
                          <Button type="button" variant="ghost" size="sm" onClick={removeImage} className="h-auto p-1" suppressHydrationWarning={true}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="w-full max-w-md h-48 bg-muted rounded-md overflow-hidden border">
                          <img
                            src={uploadedImage || formData.imageUrl || "/placeholder.svg"}
                            alt="Workshop preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                              const parent = target.parentElement
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="w-full h-full flex items-center justify-center text-muted-foreground">
                                    <p>Image not found or invalid URL</p>
                                  </div>
                                `
                              }
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {uploadedImage ? "New uploaded file preview" : "Current image"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button type="submit" disabled={submitting} className="w-full sm:w-auto" suppressHydrationWarning={true}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Update Workshop
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" asChild className="w-full sm:w-auto bg-transparent" suppressHydrationWarning={true}>
                    <Link href="/admin/dashboard/workshops">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
