"use client"

import React, { useState } from "react"
import type { IntroItem } from "@/types/home-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/custom-toast"

interface IntroFormProps {
  defaultValues?: IntroItem
  onSubmit: (fd: FormData) => void | Promise<void>
  submitting?: boolean
}

export default function IntroForm({ defaultValues, onSubmit, submitting }: IntroFormProps): React.ReactElement {
  const { showToast } = useToast()
  const [title, setTitle] = useState<string>(defaultValues?.title || "")
  const [description, setDescription] = useState<string>(defaultValues?.description || "")
  const [date, setDate] = useState<string>(() => {
    if (defaultValues?.date) return new Date(defaultValues.date).toISOString().slice(0, 10)
    return ""
  })
  const [file, setFile] = useState<File | null>(null)

  function handleLocalSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    
    // Validation
    if (!title.trim()) {
      showToast("Title is required", "error")
      return
    }
    if (!description.trim()) {
      showToast("Description is required", "error")
      return
    }
    if (!date) {
      showToast("Date is required", "error")
      return
    }

    const fd = new FormData()
    fd.append("title", title.trim())
    fd.append("description", description.trim())
    if (date) fd.append("date", date)
    if (file) fd.append("image_url", file)
    
    void onSubmit(fd)
  }

  return (
    <form onSubmit={handleLocalSubmit} className="grid gap-6 p-2">
      <div className="grid gap-3">
        <Label htmlFor="title" className="text-sm font-medium">Title</Label>
        <Input 
          id="title"
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Enter intro title" 
          required 
          className="h-11"
        />
      </div>
      
      <div className="grid gap-3">
        <Label htmlFor="description" className="text-sm font-medium">Description</Label>
        <Textarea 
          id="description"
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Enter intro description" 
          required 
          className="min-h-[120px] resize-none"
        />
      </div>
      
      <div className="grid gap-3 sm:max-w-xs">
        <Label htmlFor="date" className="text-sm font-medium">Date</Label>
        <Input 
          id="date"
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
          className="h-11"
        />
      </div>
      
      <div className="grid gap-3 sm:max-w-md">
        <Label htmlFor="image" className="text-sm font-medium">Image (optional)</Label>
        <Input 
          id="image"
          type="file" 
          accept="image/*" 
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="h-11"
        />
        {file && (
          <p className="text-xs text-muted-foreground">
            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>
      
      <div className="flex gap-3 pt-2">
        <Button 
          type="submit" 
          disabled={submitting}
          className="h-11 px-6"
        >
          {submitting ? "Saving..." : defaultValues ? "Update Intro" : "Add Intro"}
        </Button>
      </div>
    </form>
  )
}
