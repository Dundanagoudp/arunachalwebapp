"use client"

import React, { useEffect, useMemo, useState } from "react"
import { addIntro, deleteIntro, getIntro, updateIntro } from "@/service/homeService"
import type { IntroItem } from "@/types/home-types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/components/ui/custom-toast"
import { IntroDialog, DeleteConfirmDialog } from "./popups"

export default function IntroAdminPage(): React.ReactElement {
  const { showToast } = useToast()
  const [items, setItems] = useState<IntroItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [open, setOpen] = useState<boolean>(false)

  const selectedItem: IntroItem | undefined = useMemo(() => items.find(i => i._id === selectedId), [items, selectedId])

  async function refresh(): Promise<void> {
    setLoading(true)
    try {
      const res = await getIntro()
      if (res.success && res.data) {
        setItems(res.data)
      } else {
        showToast("Failed to load intro items", "error")
      }
    } catch (error) {
      showToast("Error loading intro items", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  async function handleSubmit(formData: FormData, introId?: string): Promise<void> {
    setSaving(true)
    try {
      const hasImage = formData.get("image_url") instanceof File && (formData.get("image_url") as File).size > 0
      if (!hasImage) formData.delete("image_url")

      const res = introId ? await updateIntro(introId, formData) : await addIntro(formData)
      
      if (res.success) {
        await refresh()
        showToast(
          introId ? "Intro updated successfully" : "Intro added successfully", 
          "success"
        )
        setOpen(false)
        setSelectedId(null)
      } else {
        showToast(
          introId ? "Failed to update intro" : "Failed to add intro", 
          "error"
        )
      }
    } catch (error) {
      showToast("An error occurred while saving", "error")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string): Promise<void> {
    setSaving(true)
    try {
      const res = await deleteIntro(id)
      if (res.success) {
        await refresh()
      } else {
        showToast("Failed to delete intro", "error")
      }
    } catch (error) {
      showToast("An error occurred while deleting", "error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Home Intro Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your homepage intro entries and content
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => { setSelectedId(null); setOpen(true) }}
          className="h-10 px-4"
        >
          Add New Intro
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Existing Intros</CardTitle>
          <CardDescription className="text-sm">
            View and manage your homepage intro entries. Click edit to modify or delete to remove.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 flex items-center justify-center gap-3 text-sm text-muted-foreground">
              <Spinner />
              Loading intro items...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="font-semibold text-gray-900">Title</TableHead>
                    <TableHead className="font-semibold text-gray-900">Description</TableHead>
                    <TableHead className="font-semibold text-gray-900">Date</TableHead>
                    <TableHead className="w-[160px] font-semibold text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((it) => (
                    <TableRow key={it._id} className="hover:bg-gray-50/50">
                      <TableCell className="font-medium max-w-[280px] truncate" title={it.title}>
                        {it.title}
                      </TableCell>
                      <TableCell className="max-w-[500px] truncate text-sm text-muted-foreground" title={it.description}>
                        {it.description}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(it.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => { setSelectedId(it._id); setOpen(true) }}
                            className="h-8 px-3 text-xs"
                          >
                            Edit
                          </Button>
                          <DeleteConfirmDialog 
                            onConfirm={() => handleDelete(it._id)} 
                            itemName="intro"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 text-sm text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <p>No intro items yet</p>
                          <p className="text-xs">Click "Add New Intro" to get started</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Intro Dialog */}
      <IntroDialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open)
          if (!open) setSelectedId(null)
        }}
        selectedItem={selectedItem}
        onSubmit={async (fd) => await handleSubmit(fd, selectedItem?._id)}
        submitting={saving}
      />
    </div>
  )
}
