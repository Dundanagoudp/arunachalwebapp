"use client"

import { useState, useEffect } from "react"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Plus, Search, Users, MessageSquare, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import type { Testimonial } from "@/types/testimonial-types"
import { getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial } from "@/service/testimonialService"
import { TestimonialCard } from "@/components/admin/home/testimonial/testimonial-card"
import { TestimonialForm } from "@/components/admin/home/testimonial/testimonial-form"
import { DeleteConfirmationDialog } from "@/components/admin/home/testimonial/delete-confirmation-dialog"

const ITEMS_PER_PAGE = 6

export default function TestimonialsManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [deletingTestimonial, setDeletingTestimonial] = useState<Testimonial | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const { toast } = useToast()

  // Fetch testimonials
  const fetchTestimonials = async () => {
    setLoading(true)
    try {
      const response = await getTestimonials()
      if (response.success && response.data) {
        setTestimonials(response.data)
        setFilteredTestimonials(response.data)
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to fetch testimonials",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  // Search functionality
  useEffect(() => {
    const filtered = testimonials.filter(
      (testimonial) =>
        testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.about.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredTestimonials(filtered)
    setCurrentPage(1)
  }, [searchTerm, testimonials])

  // Pagination
  const totalPages = Math.ceil(filteredTestimonials.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentTestimonials = filteredTestimonials.slice(startIndex, endIndex)

  // Handle form submission
  const handleFormSubmit = async (formData: FormData) => {
    setFormLoading(true)
    try {
      let response
      if (editingTestimonial) {
        response = await updateTestimonial(editingTestimonial._id, formData)
      } else {
        response = await addTestimonial(formData)
      }

      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        })
        setIsFormOpen(false)
        setEditingTestimonial(null)
        fetchTestimonials()
      } else {
        toast({
          title: "Error",
          description: response.error || "Operation failed",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
      })
    } finally {
      setFormLoading(false)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!deletingTestimonial) return

    setDeleteLoading(true)
    try {
      const response = await deleteTestimonial(deletingTestimonial._id)
      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        })
        setIsDeleteDialogOpen(false)
        setDeletingTestimonial(null)
        fetchTestimonials()
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete testimonial",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  // Handle edit
  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setIsFormOpen(true)
  }

  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    const testimonial = testimonials.find(t => t._id === id)
    if (testimonial) {
      setDeletingTestimonial(testimonial)
      setIsDeleteDialogOpen(true)
    }
  }

  // Handle add new
  const handleAddNew = () => {
    setEditingTestimonial(null)
    setIsFormOpen(true)
  }

  // Handle form cancel
  const handleFormCancel = () => {
    setIsFormOpen(false)
    setEditingTestimonial(null)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center gap-2 px-2 sm:px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/dashboard">Admin Panel</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-sm sm:text-base">Testimonials Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Testimonials</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testimonials.length}</div>
                <p className="text-xs text-muted-foreground">Customer feedback entries</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{new Set(testimonials.map((t) => t.about)).size}</div>
                <p className="text-xs text-muted-foreground">Different customers</p>
              </CardContent>
            </Card>
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Search Results</CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredTestimonials.length}</div>
                <p className="text-xs text-muted-foreground">Matching testimonials</p>
              </CardContent>
            </Card>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search testimonials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  suppressHydrationWarning
                />
              </div>
              <Button
                variant="outline"
                onClick={fetchTestimonials}
                disabled={loading}
                className="shrink-0 bg-transparent"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
            <Button onClick={handleAddNew} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </div>

          {/* Testimonials Grid */}
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-20 w-full" />
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : currentTestimonials.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {currentTestimonials.map((testimonial) => (
                  <TestimonialCard
                    key={testimonial._id}
                    testimonial={testimonial}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No testimonials found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm
                    ? "No testimonials match your search criteria."
                    : "Get started by adding your first testimonial."}
                </p>
                {!searchTerm && (
                  <Button onClick={handleAddNew}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Testimonial
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}</DialogTitle>
            </DialogHeader>
            <TestimonialForm
              testimonial={editingTestimonial || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isLoading={formLoading}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          isLoading={deleteLoading}
          testimonialName={deletingTestimonial?.about || ""}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}
