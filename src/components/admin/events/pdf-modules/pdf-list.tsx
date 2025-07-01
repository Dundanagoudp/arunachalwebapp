"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { FileText, Download, Edit, Trash2, Loader2, RefreshCw } from "lucide-react"
import { getPdfs, deletePdf } from "@/service/addPdfServices"
import type { PdfDocument } from "@/types/addPdf-types"
import { PdfUpdateDialog } from "./pdf-update-dialog"
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

interface PdfListProps {
  refreshTrigger?: number
}

export function PdfList({ refreshTrigger }: PdfListProps) {
  const [pdfs, setPdfs] = useState<PdfDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [selectedPdf, setSelectedPdf] = useState<PdfDocument | null>(null)
  const { toast } = useToast()

  const fetchPdfs = async () => {
    setIsLoading(true)
    try {
      const result = await getPdfs()
      if (result.success && result.data) {
        setPdfs(result.data)
      } else {
        toast({
          title: "Failed to fetch PDFs",
          description: result.error,
          
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch PDFs",

      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPdfs()
  }, [refreshTrigger])

  const handleDelete = async (pdfId: string) => {
    setDeletingId(pdfId)
    try {
      const result = await deletePdf(pdfId)
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        fetchPdfs() // Refresh the list
      } else {
        toast({
          title: "Delete failed",
          description: result.error,
          
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete PDF",
        
      })
    } finally {
      setDeletingId(null)
    }
  }

  const handleDownload = (url: string) => {
    window.open(url, "_blank")
  }

  const handleUpdate = (pdf: PdfDocument) => {
    setSelectedPdf(pdf)
    setUpdateDialogOpen(true)
  }

  const handleUpdateSuccess = () => {
    setUpdateDialogOpen(false)
    setSelectedPdf(null)
    fetchPdfs()
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading PDFs...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
            <div>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <FileText className="h-5 w-5" />
                Event Brochures
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Manage your event brochure PDF files</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchPdfs} className="w-full sm:w-auto mt-2 sm:mt-0">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {pdfs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No PDF files found</p>
              <p className="text-sm">Upload your first event brochure to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pdfs.map((pdf) => (
                <div
                  key={pdf._id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-2 sm:gap-0"
                >
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <FileText className="h-8 w-8 text-red-500" />
                    <div>
                      <p className="font-medium text-sm sm:text-base">Event Brochure</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" onClick={() => handleDownload(pdf.pdf_url)} className="w-full sm:w-auto">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleUpdate(pdf)} className="w-full sm:w-auto">
                      <Edit className="h-4 w-4 mr-2" />
                      Update
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" disabled={deletingId === pdf._id} className="w-full sm:w-auto">
                          {deletingId === pdf._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-2" />
                          )}
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the PDF file.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(pdf._id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedPdf && (
        <PdfUpdateDialog
          pdf={selectedPdf}
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </>
  )
}
