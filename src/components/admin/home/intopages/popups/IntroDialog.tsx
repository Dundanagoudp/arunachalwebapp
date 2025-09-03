"use client"

import React from "react"
import type { IntroItem } from "@/types/home-types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import IntroForm from "./IntroForm"

interface IntroDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedItem?: IntroItem
  onSubmit: (fd: FormData) => void | Promise<void>
  submitting?: boolean
}

export default function IntroDialog({ 
  open, 
  onOpenChange, 
  selectedItem, 
  onSubmit, 
  submitting 
}: IntroDialogProps): React.ReactElement {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold">
            {selectedItem ? "Edit Intro" : "Add New Intro"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {selectedItem 
              ? "Update the intro details below and save your changes." 
              : "Fill in the details below to create a new intro entry."
            }
          </DialogDescription>
        </DialogHeader>
        <IntroForm
          key={selectedItem?._id || "new"}
          defaultValues={selectedItem}
          onSubmit={onSubmit}
          submitting={submitting}
        />
      </DialogContent>
    </Dialog>
  )
}
