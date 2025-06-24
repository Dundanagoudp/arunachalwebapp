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
import { BookOpen, Save, ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CreateWorkshop() {
  const [formData, setFormData] = useState({
    name: "",
    about: "",
    imageUrl: "",
    registrationFormUrl: "",
    eventRef: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating workshop:", formData)
    // Handle form submission here
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
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
                  <BreadcrumbLink href="/admin/workshops">Workshops</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Create Workshop</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Create New Workshop</h1>
              <p className="text-muted-foreground">Add a new workshop to your events.</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin/workshops">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Workshops
              </Link>
            </Button>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Workshop Details
              </CardTitle>
              <CardDescription>Fill in the information for your new workshop.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Workshop Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter workshop name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventRef">Associated Event</Label>
                  <select
                    id="eventRef"
                    name="eventRef"
                    value={formData.eventRef}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select an event</option>
                    <option value="1">Arunachal Pradesh Literature Festival 2024</option>
                    <option value="2">Traditional Stories Workshop</option>
                    <option value="3">Modern Literature Symposium</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationFormUrl">Registration Form URL</Label>
                  <Input
                    id="registrationFormUrl"
                    name="registrationFormUrl"
                    type="url"
                    placeholder="https://docs.google.com/forms/..."
                    value={formData.registrationFormUrl}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Workshop Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      placeholder="Enter image URL or upload image"
                      value={formData.imageUrl}
                      onChange={handleChange}
                    />
                    <Button type="button" variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Create Workshop
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/admin/workshops">Cancel</Link>
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
