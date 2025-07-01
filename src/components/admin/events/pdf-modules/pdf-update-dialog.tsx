"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, Loader2 } from "lucide-react"
import { updatePdf } from "@/service/addPdfServices" 
import type { PdfDocument } from "@/types/addPdf-types" 

interface PdfUpdateDialogProps {
  pdf: PdfDocument
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function PdfUpdateDialog({ pdf, open, onOpenChange, onSuccess }: PdfUpdateDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file.",
          
        })
        return
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB.",
          
        })
        return
      }
      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to upload.",
        
      })
      return
    }

    setIsUpdating(true)

    try {
      const formData = new FormData()
      formData.append("pdf", file)

      const result = await updatePdf(pdf._id, formData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        setFile(null)
        onSuccess()
      } else {
        toast({
          title: "Update failed",
          description: result.error,
          
        })
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "An unexpected error occurred.",
        
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-[95vw] max-w-[400px] p-2 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Upload className="h-5 w-5" />
            Update PDF
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">Replace the current PDF file with a new one</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="update-pdf-file" className="text-sm sm:text-base">New PDF File</Label>
            <Input id="update-pdf-file" type="file" accept=".pdf" onChange={handleFileChange} disabled={isUpdating} className="text-xs sm:text-sm" />
            {file && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>{file.name}</span>
                <span>({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 flex-col sm:flex-row">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isUpdating} className="w-full sm:w-auto text-xs sm:text-base">
              Cancel
            </Button>
            <Button type="submit" disabled={!file || isUpdating} className="w-full sm:w-auto text-xs sm:text-base">
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Update PDF
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
