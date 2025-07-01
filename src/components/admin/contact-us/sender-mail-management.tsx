"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Mail, Edit, Trash2, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { SenderMail } from "@/types/contactus-types"
import { getAllSenderMail, addSenderMail, updateSenderMail, deleteSenderMail } from "@/service/contactusServices"

// Add a helper component for action buttons
interface SenderMailActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}
function SenderMailActions({ onEdit, onDelete, isDeleting }: SenderMailActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
        <Edit className="h-4 w-4 mr-1" />
        Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="text-red-600 hover:text-red-700 bg-transparent flex-1"
        onClick={onDelete}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Delete
      </Button>
    </div>
  )
}

export function SenderMailManagement() {
  const [senderMails, setSenderMails] = useState<SenderMail[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingMail, setEditingMail] = useState<SenderMail | null>(null)
  const [newEmail, setNewEmail] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const fetchSenderMails = async () => {
    setLoading(true)
    try {
      const response = await getAllSenderMail()
      if (response.success && response.data) {
        setSenderMails(response.data)
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to fetch sender mails",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch sender mails",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSenderMails()
  }, [])

  const handleAddSenderMail = async () => {
    if (!newEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
      })
      return
    }

    setSubmitting(true)
    try {
      const response = await addSenderMail({ mail: newEmail.trim() })
      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Sender mail added successfully",
        })
        setNewEmail("")
        setIsAddOpen(false)
        fetchSenderMails()
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to add sender mail",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add sender mail",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateSenderMail = async () => {
    if (!editEmail.trim() || !editingMail) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
      })
      return
    }

    setSubmitting(true)
    try {
      const response = await updateSenderMail(editingMail._id, { mail: editEmail.trim() })
      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Sender mail updated successfully",
        })
        setEditEmail("")
        setEditingMail(null)
        setIsEditOpen(false)
        fetchSenderMails()
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update sender mail",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update sender mail",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteSenderMail = async (mailId: string) => {
    try {
      const response = await deleteSenderMail(mailId)
      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Sender mail deleted successfully",
        })
        fetchSenderMails()
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete sender mail",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete sender mail",
      })
    }
  }

  const openEditDialog = (mail: SenderMail) => {
    setEditingMail(mail)
    setEditEmail(mail.mail)
    setIsEditOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Sender Email Management
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Manage authorized sender email addresses</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchSenderMails} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Email
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : senderMails.length === 0 ? (
          <div className="text-center py-8">
            <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No sender emails configured</p>
            <p className="text-sm text-gray-400 mb-4">Add an email address to get started</p>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Email
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        ) : (
          <div className="space-y-3">
            {senderMails.map((mail) => (
              <div
                key={mail._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Mail className="h-4 w-4 text-blue-500" />
                  <span className="font-medium truncate">{mail.mail}</span>
                  <Badge variant="secondary" className="text-xs">
                    Active
                  </Badge>
                </div>
                <div className="w-full sm:w-auto">
                  <SenderMailActions
                    onEdit={() => openEditDialog(mail)}
                    onDelete={() => handleDeleteSenderMail(mail._id)}
                    isDeleting={false}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Email Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="w-full max-w-md sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Sender Email</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-email">Email Address</Label>
                <Input
                  id="new-email"
                  type="email"
                  placeholder="Enter email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddOpen(false)
                    setNewEmail("")
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleAddSenderMail} disabled={submitting} className="flex-1">
                  {submitting ? "Adding..." : "Add Email"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Email Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="w-full max-w-md sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Sender Email</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address</Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="Enter email address"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditOpen(false)
                    setEditEmail("")
                    setEditingMail(null)
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateSenderMail} disabled={submitting} className="flex-1">
                  {submitting ? "Updating..." : "Update Email"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
