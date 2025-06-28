"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, BookOpen, User } from "lucide-react"

interface PoetryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { text: string; author: string }) => void
  title: string
  submitText: string
  loading?: boolean
  initialData?: {
    text: string
    author: string
  }
}

export function PoetryModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  submitText,
  loading = false,
  initialData,
}: PoetryModalProps) {
  const [formData, setFormData] = useState({
    text: "",
    author: "",
  })
  const [errors, setErrors] = useState({
    text: "",
    author: "",
  })

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        text: initialData?.text || "",
        author: initialData?.author || "",
      })
      setErrors({ text: "", author: "" })
    }
  }, [isOpen, initialData])

  const validateForm = () => {
    const newErrors = { text: "", author: "" }
    let isValid = true

    if (!formData.text.trim()) {
      newErrors.text = "Poetry text is required"
      isValid = false
    }

    if (!formData.author.trim()) {
      newErrors.author = "Author name is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSubmit({
      text: formData.text.trim(),
      author: formData.author.trim(),
    })
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-200">
        <DialogHeader className="space-y-3 sm:space-y-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0 mt-1 sm:mt-0">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base sm:text-lg font-semibold">{title}</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
                {initialData ? "Update the poetry details below." : "Add a new poetry to your collection."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text" className="text-xs sm:text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                Poetry Text
              </Label>
              <Textarea
                id="text"
                placeholder="Enter the poetry text..."
                value={formData.text}
                onChange={(e) => handleInputChange("text", e.target.value)}
                className={`min-h-[100px] sm:min-h-[120px] resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/20 text-sm sm:text-base ${
                  errors.text ? "border-destructive focus:ring-destructive/20" : ""
                }`}
                disabled={loading}
                suppressHydrationWarning
              />
              {errors.text && (
                <p className="text-xs sm:text-sm text-destructive animate-in fade-in-0 slide-in-from-top-1 duration-200">
                  {errors.text}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="author" className="text-xs sm:text-sm font-medium flex items-center gap-2">
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                Author
              </Label>
              <Input
                id="author"
                placeholder="Enter author name..."
                value={formData.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
                className={`transition-all duration-200 focus:ring-2 focus:ring-primary/20 text-sm sm:text-base ${
                  errors.author ? "border-destructive focus:ring-destructive/20" : ""
                }`}
                disabled={loading}
                suppressHydrationWarning
              />
              {errors.author && (
                <p className="text-xs sm:text-sm text-destructive animate-in fade-in-0 slide-in-from-top-1 duration-200">
                  {errors.author}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-3 flex-col sm:flex-row">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              disabled={loading}
              className="transition-all duration-200 hover:scale-105 active:scale-95 w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="transition-all duration-200 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-primary/20 w-full sm:w-auto order-1 sm:order-2"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
