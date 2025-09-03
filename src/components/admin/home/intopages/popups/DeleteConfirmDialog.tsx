"use client"

import React from "react"
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
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/custom-toast"

interface DeleteConfirmDialogProps {
  onConfirm: () => void | Promise<void>
  itemName?: string
}

export default function DeleteConfirmDialog({ onConfirm, itemName = "intro" }: DeleteConfirmDialogProps): React.ReactElement {
  const { showToast } = useToast()

  const handleConfirm = async () => {
    try {
      await onConfirm()
      showToast(`${itemName.charAt(0).toUpperCase() + itemName.slice(1)} deleted successfully`, "success")
    } catch (error) {
      showToast(`Failed to delete ${itemName}`, "error")
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive" className="h-8 px-3">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            Delete {itemName.charAt(0).toUpperCase() + itemName.slice(1)}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            This action cannot be undone. The {itemName} will be permanently removed from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel className="h-9 px-4">Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className="h-9 px-4 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
