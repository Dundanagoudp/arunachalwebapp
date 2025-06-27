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
import { Loader2 } from "lucide-react"

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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update the poetry details below." : "Add a new poetry to your collection."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">Poetry Text</Label>
            <Textarea
              id="text"
              placeholder="Enter the poetry text..."
              value={formData.text}
              onChange={(e) => handleInputChange("text", e.target.value)}
              className={`min-h-[100px] ${errors.text ? "border-destructive" : ""}`}
              disabled={loading}
            />
            {errors.text && <p className="text-sm text-destructive">{errors.text}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              placeholder="Enter author name..."
              value={formData.author}
              onChange={(e) => handleInputChange("author", e.target.value)}
              className={errors.author ? "border-destructive" : ""}
              disabled={loading}
            />
            {errors.author && <p className="text-sm text-destructive">{errors.author}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
