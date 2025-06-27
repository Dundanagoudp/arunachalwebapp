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
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { PoetryModal } from "@/components/admin/home/poetry/poetry-modal"
import { DeleteConfirmDialog } from "@/components/admin/home/poetry/delete-confirm-dialog"
import { useToast } from "@/hooks/use-toast"
import { addPoetry, updatePoetry, getPoetry, deletePoetry } from "@/service/poetryService"

interface Poetry {
  _id: string
  text: string
  author: string
  __v: number
}

export default function PoetryManagementPage() {
  const [poetry, setPoetry] = useState<Poetry[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPoetry, setSelectedPoetry] = useState<Poetry | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const { toast } = useToast()

  // Fetch all poetry on component mount
  useEffect(() => {
    fetchPoetry()
  }, [])

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
                <BreadcrumbItem>
                  <BreadcrumbPage>Poetry Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Poetry Management</h1>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Poetry
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Poetry Collection</CardTitle>
              <CardDescription>
                {poetry.length} {poetry.length === 1 ? "poem" : "poems"} in your collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading poetry...</span>
                </div>
              ) : poetry.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No poetry found. Add your first poem!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {poetry.map((poetryItem) => (
                    <div
                      key={poetryItem._id}
                      className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-medium leading-relaxed">"{poetryItem.text}"</p>
                        <p className="text-sm text-muted-foreground">— {poetryItem.author}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(poetryItem)} className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(poetryItem)}
                          className="gap-2 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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
