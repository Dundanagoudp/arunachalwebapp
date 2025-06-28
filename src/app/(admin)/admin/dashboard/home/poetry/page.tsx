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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { PoetryModal } from "@/components/admin/home/poetry/poetry-modal"
import { DeleteConfirmDialog } from "@/components/admin/home/poetry/delete-confirm-dialog"
import { useToast } from "@/hooks/use-toast"
import { addPoetry, updatePoetry, getPoetry, deletePoetry } from "@/service/poetryService"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Poetry {
  _id: string
  text: string
  author: string
  __v: number
}

// Skeleton component for poetry items
function PoetrySkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-4 border rounded-lg space-y-3 sm:space-y-0">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-32" />
      </div>
      <div className="flex items-center gap-2 sm:ml-4">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  )
}

export default function PoetryManagementPage() {
  const [poetry, setPoetry] = useState<Poetry[]>([])
  const [filteredPoetry, setFilteredPoetry] = useState<Poetry[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPoetry, setSelectedPoetry] = useState<Poetry | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const { toast } = useToast()

  // Calculate pagination
  const totalPages = Math.ceil(filteredPoetry.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPoetry = filteredPoetry.slice(startIndex, endIndex)

  // Fetch all poetry on component mount
  useEffect(() => {
    fetchPoetry()
  }, [])

  // Filter poetry based on search term
  useEffect(() => {
    const filtered = poetry.filter(
      (item) =>
        item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPoetry(filtered)
    setCurrentPage(1) // Reset to first page when searching
  }, [poetry, searchTerm])

  const fetchPoetry = async () => {
    try {
      setLoading(true)
      const response = await getPoetry()
      if (response.success) {
        setPoetry(response.data)
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to fetch poetry",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch poetry",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddPoetry = async (data: { text: string; author: string }) => {
    try {
      setActionLoading(true)
      const response = await addPoetry(data)
      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Poetry added successfully",
        })
        setIsAddModalOpen(false)
        fetchPoetry() // Refresh the list
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to add poetry",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add poetry",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleEditPoetry = async (data: { text: string; author: string }) => {
    if (!selectedPoetry) return

    try {
      setActionLoading(true)
      const response = await updatePoetry(selectedPoetry._id, data)
      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Poetry updated successfully",
        })
        setIsEditModalOpen(false)
        setSelectedPoetry(null)
        fetchPoetry() // Refresh the list
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update poetry",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update poetry",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeletePoetry = async () => {
    if (!selectedPoetry) return

    try {
      setActionLoading(true)
      const response = await deletePoetry(selectedPoetry._id)
      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Poetry deleted successfully",
        })
        setIsDeleteDialogOpen(false)
        setSelectedPoetry(null)
        fetchPoetry() // Refresh the list
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete poetry",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete poetry",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const openEditModal = (poetryItem: Poetry) => {
    setSelectedPoetry(poetryItem)
    setIsEditModalOpen(true)
  }

  const openDeleteDialog = (poetryItem: Poetry) => {
    setSelectedPoetry(poetryItem)
    setIsDeleteDialogOpen(true)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
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
                  <BreadcrumbPage className="text-sm sm:text-base">Poetry Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-2 sm:p-4">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Poetry Management</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Manage your poetry collection</p>
            </div>
            <Button 
              onClick={() => setIsAddModalOpen(true)} 
              className="gap-2 transition-all duration-200 hover:scale-105 active:scale-95 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Poetry</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search poetry or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                suppressHydrationWarning
              />
            </div>
            <div className="text-sm text-muted-foreground text-center sm:text-left">
              {filteredPoetry.length} of {poetry.length} poems
            </div>
          </div>

          <Card className="transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                Poetry Collection
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {filteredPoetry.length} {filteredPoetry.length === 1 ? "poem" : "poems"} found
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <PoetrySkeleton key={i} />
                  ))}
                </div>
              ) : currentPoetry.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Search className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2">No poetry found</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 px-4">
                    {searchTerm ? "Try adjusting your search terms." : "Add your first poem to get started!"}
                  </p>
                  {!searchTerm && (
                    <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Poetry
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="space-y-3 sm:space-y-4">
                    {currentPoetry.map((poetryItem, index) => (
                      <div
                        key={poetryItem._id}
                        className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-all duration-200 group animate-in fade-in-0 slide-in-from-bottom-4"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animationDuration: '0.5s',
                          animationTimingFunction: 'ease-out',
                          animationFillMode: 'forwards'
                        }}
                      >
                        <div className="flex-1 space-y-2 mb-3 sm:mb-0">
                          <p className="text-sm sm:text-base font-medium leading-relaxed group-hover:text-primary transition-colors">
                            "{poetryItem.text}"
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">— {poetryItem.author}</p>
                        </div>
                        <div className="flex items-center gap-2 sm:ml-4 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => openEditModal(poetryItem)} 
                            className="gap-1 sm:gap-2 transition-all duration-200 hover:scale-105 active:scale-95 flex-1 sm:flex-none"
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(poetryItem)}
                            className="gap-1 sm:gap-2 text-destructive hover:text-destructive transition-all duration-200 hover:scale-105 active:scale-95 flex-1 sm:flex-none"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                      <Pagination>
                        <PaginationContent className="flex-wrap">
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => handlePageChange(currentPage - 1)}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                          
                          {/* Show limited page numbers on mobile */}
                          {totalPages <= 5 ? (
                            // Show all pages if 5 or fewer
                            Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => handlePageChange(page)}
                                  isActive={currentPage === page}
                                  className="cursor-pointer transition-all duration-200 hover:scale-105"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            ))
                          ) : (
                            // Show smart pagination for more pages
                            <>
                              {currentPage > 2 && (
                                <>
                                  <PaginationItem>
                                    <PaginationLink
                                      onClick={() => handlePageChange(1)}
                                      className="cursor-pointer transition-all duration-200 hover:scale-105"
                                    >
                                      1
                                    </PaginationLink>
                                  </PaginationItem>
                                  {currentPage > 3 && (
                                    <PaginationItem>
                                      <PaginationEllipsis />
                                    </PaginationItem>
                                  )}
                                </>
                              )}
                              
                              {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(page => page >= Math.max(1, currentPage - 1) && page <= Math.min(totalPages, currentPage + 1))
                                .map((page) => (
                                  <PaginationItem key={page}>
                                    <PaginationLink
                                      onClick={() => handlePageChange(page)}
                                      isActive={currentPage === page}
                                      className="cursor-pointer transition-all duration-200 hover:scale-105"
                                    >
                                      {page}
                                    </PaginationLink>
                                  </PaginationItem>
                                ))}
                              
                              {currentPage < totalPages - 1 && (
                                <>
                                  {currentPage < totalPages - 2 && (
                                    <PaginationItem>
                                      <PaginationEllipsis />
                                    </PaginationItem>
                                  )}
                                  <PaginationItem>
                                    <PaginationLink
                                      onClick={() => handlePageChange(totalPages)}
                                      className="cursor-pointer transition-all duration-200 hover:scale-105"
                                    >
                                      {totalPages}
                                    </PaginationLink>
                                  </PaginationItem>
                                </>
                              )}
                            </>
                          )}
                          
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => handlePageChange(currentPage + 1)}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add Poetry Modal */}
        <PoetryModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddPoetry}
          title="Add New Poetry"
          submitText="Add Poetry"
          loading={actionLoading}
        />

        {/* Edit Poetry Modal */}
        <PoetryModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedPoetry(null)
          }}
          onSubmit={handleEditPoetry}
          title="Edit Poetry"
          submitText="Update Poetry"
          loading={actionLoading}
          initialData={
            selectedPoetry
              ? {
                  text: selectedPoetry.text,
                  author: selectedPoetry.author,
                }
              : undefined
          }
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false)
            setSelectedPoetry(null)
          }}
          onConfirm={handleDeletePoetry}
          title="Delete Poetry"
          description={
            selectedPoetry
              ? `Are you sure you want to delete "${selectedPoetry.text}" by ${selectedPoetry.author}? This action cannot be undone.`
              : "Are you sure you want to delete this poetry?"
          }
          loading={actionLoading}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}
