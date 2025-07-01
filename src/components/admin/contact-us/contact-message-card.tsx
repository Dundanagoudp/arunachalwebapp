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
  onReply?: (id: string, data: { message: string }) => Promise<void>
}

// Add a helper component for action buttons
interface ActionButtonsProps {
  onView: () => void;
  onReply?: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
  showReply?: boolean;
}
function ActionButtons({ onView, onReply, onDelete, isDeleting, showReply }: ActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 pt-2 w-full">
      <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={onView}>
        <Eye className="h-4 w-4 mr-2" />
        View Details
      </Button>
      {showReply && onReply && (
        <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={onReply}>
          <Mail className="h-4 w-4 mr-2" />
          Reply
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent flex-1"
        onClick={onDelete}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  )
}

export function ContactMessageCard({ contact, onDelete, isDeleting, onReply }: ContactMessageCardProps) {
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isReplyOpen, setIsReplyOpen] = useState(false)
  const [replyMessage, setReplyMessage] = useState("")
  const [replyLoading, setReplyLoading] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleReply = async () => {
    if (!onReply) return
    setReplyLoading(true)
    try {
      await onReply(contact._id, { message: replyMessage })
      setIsReplyOpen(false)
      setReplyMessage("")
    } finally {
      setReplyLoading(false)
    }
  }

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 relative">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 w-full">
            <div className="space-y-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                {contact.name}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
                <Mail className="h-4 w-4" />
                <span className="truncate">{contact.email}</span>
              </div>
              {contact.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
                  <Phone className="h-4 w-4" />
                  <span className="truncate">{contact.phone}</span>
                </div>
              )}
            </div>
            <div className="flex flex-row sm:flex-col items-end gap-1 shrink-0 mt-2 sm:mt-0">
              <Badge variant="secondary" className="text-xs whitespace-nowrap">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(contact.createdAt)}
              </Badge>
              {contact.isReplied && (
                <span className="mt-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200 whitespace-nowrap">Replied</span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700 line-clamp-3">{contact.message}</p>
            </div>
            <ActionButtons
              onView={() => setIsViewOpen(true)}
              onReply={onReply ? () => setIsReplyOpen(true) : undefined}
              onDelete={() => onDelete(contact._id)}
              isDeleting={isDeleting}
              showReply={!!onReply}
            />
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
    </>
  )
}
