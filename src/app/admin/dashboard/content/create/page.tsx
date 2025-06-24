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
import { FileText, Save, ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CreateContent() {
  const [contentType, setContentType] = useState("blog")
  const [formData, setFormData] = useState({
    title: "",
    contents: "",
    link: "",
    image_url: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating content:", { ...formData, contentType })
    // Handle form submission here
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
                  <BreadcrumbLink href="/admin/content">Content</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Create Content</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Create New Content</h1>
              <p className="text-muted-foreground">Add new blog posts, news articles, or external links.</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin/content/blogs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Content
              </Link>
            </Button>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Content Details
              </CardTitle>
              <CardDescription>Fill in the information for your new content.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="contentType">Content Type *</Label>
                  <select
                    id="contentType"
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="blog">Blog Post</option>
                    <option value="link">External Link</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter content title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                {contentType === "blog" && (
                  <div className="space-y-2">
                    <Label htmlFor="contents">Content *</Label>
                    <Textarea
                      id="contents"
                      name="contents"
                      placeholder="Enter your blog content here..."
                      value={formData.contents}
                      onChange={handleChange}
                      rows={10}
                      required
                    />
                  </div>
                )}

                {contentType === "link" && (
                  <div className="space-y-2">
                    <Label htmlFor="link">External Link *</Label>
                    <Input
                      id="link"
                      name="link"
                      type="url"
                      placeholder="https://example.com"
                      value={formData.link}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="image_url">Featured Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image_url"
                      name="image_url"
                      placeholder="Enter image URL or upload image"
                      value={formData.image_url}
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
                    Create Content
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/admin/content/blogs">Cancel</Link>
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
