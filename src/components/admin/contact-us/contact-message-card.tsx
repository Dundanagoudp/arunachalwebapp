"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Eye, Trash2, Mail, Phone, Calendar, User } from "lucide-react"
import type { ContactMessage } from "@/types/contactus-types"

interface ContactMessageCardProps {
  contact: ContactMessage
  onDelete: (id: string) => void
  isDeleting?: boolean
}

// Add a helper component for action buttons
interface ActionButtonsProps {
  onView: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}
function ActionButtons({ onView, onDelete, isDeleting }: ActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex-1 bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 shadow-sm" 
        onClick={onView}
      >
        <Eye className="h-4 w-4 mr-2" />
        View Details
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 bg-white transition-all duration-200 shadow-sm"
        onClick={onDelete}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  )
}

export function ContactMessageCard({ contact, onDelete, isDeleting }: ContactMessageCardProps) {
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      <Card className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200 shadow-md relative h-full flex flex-col bg-white hover:border-blue-300">
        <CardHeader className="pb-3 flex-shrink-0 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 w-full">
            <div className="space-y-1 min-w-0 flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                {contact.name}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
                <Mail className="h-4 w-4" />
                <span className="truncate">{contact.email}</span>
              </div>
              {contact.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span className="truncate">{contact.phone}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatDate(contact.createdAt)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-row sm:flex-col items-end gap-1 shrink-0 mt-2 sm:mt-0">
              {contact.isReplied && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200 whitespace-nowrap">Replied</span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 flex-1 shadow-sm">
              <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">{contact.message}</p>
            </div>
            <div className="mt-auto">
              <ActionButtons
                onView={() => setIsViewOpen(true)}
                onDelete={() => setIsDeleteOpen(true)}
                isDeleting={isDeleting}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Contact Message Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Name</label>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">{contact.name}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">{contact.email}</p>
              </div>
              {contact.phone && (
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{contact.phone}</p>
                </div>
              )}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Date Received</label>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">{formatDate(contact.createdAt)}</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Message</label>
              <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{contact.message}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Delete Contact Message
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this contact message from <strong>{contact.name}</strong>? 
              This action cannot be undone and will permanently remove the message from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(contact._id)
                setIsDeleteOpen(false)
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Message"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  )
}
