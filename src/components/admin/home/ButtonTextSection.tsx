import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { addButtonText, getButtonText, updateButtonText, deleteButtonText } from "@/service/homeService"

interface ButtonText {
  _id: string
  text: string
  link: string
  __v: number
}

export default function ButtonTextSection() {
  const { toast } = useToast()
  const [buttonTexts, setButtonTexts] = useState<ButtonText[]>([])
  const [loading, setLoading] = useState({ buttonTexts: false, action: false })
  const [dialogs, setDialogs] = useState({ addButtonText: false, editButtonText: false })
  const [editingButtonText, setEditingButtonText] = useState<ButtonText | null>(null)
  const [buttonTextForm, setButtonTextForm] = useState({ text: "", link: "" })

  const fetchButtonTexts = async () => {
    setLoading((prev) => ({ ...prev, buttonTexts: true }))
    try {
      const response = await getButtonText()
      if (response.success) {
        setButtonTexts(Array.isArray(response.data) ? response.data : [response.data])
      } else {
        toast({ title: "Error", description: response.error || "Failed to fetch button texts" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch button texts" })
    } finally {
      setLoading((prev) => ({ ...prev, buttonTexts: false }))
    }
  }

  const handleAddButtonText = async () => {
    if (!buttonTextForm.link.trim()) {
      toast({ title: "Error", description: "Button link is required" })
      return
    }
    setLoading((prev) => ({ ...prev, action: true }))
    try {
      const response = await addButtonText(buttonTextForm)
      if (response.success) {
        toast({ title: "Success", description: response.message || "Button text added successfully" })
        setDialogs((prev) => ({ ...prev, addButtonText: false }))
        setButtonTextForm({ text: "", link: "" })
        fetchButtonTexts()
      } else {
        toast({ title: "Error", description: response.error || "Failed to add button text" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to add button text" })
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const handleUpdateButtonText = async () => {
    if (!editingButtonText || !buttonTextForm.link.trim()) {
      toast({ title: "Error", description: "Button link is required" })
      return
    }
    setLoading((prev) => ({ ...prev, action: true }))
    try {
      const response = await updateButtonText(editingButtonText._id, buttonTextForm)
      if (response.success) {
        toast({ title: "Success", description: response.message || "Button text updated successfully" })
        setDialogs((prev) => ({ ...prev, editButtonText: false }))
        setButtonTextForm({ text: "", link: "" })
        setEditingButtonText(null)
        fetchButtonTexts()
      } else {
        toast({ title: "Error", description: response.error || "Failed to update button text" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update button text" })
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const handleDeleteButtonText = async (buttonId: string) => {
    setLoading((prev) => ({ ...prev, action: true }))
    try {
      const response = await deleteButtonText(buttonId)
      if (response.success) {
        toast({ title: "Success", description: response.message || "Button text deleted successfully" })
        fetchButtonTexts()
      } else {
        toast({ title: "Error", description: response.error || "Failed to delete button text" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete button text" })
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const openEditButtonTextDialog = (buttonText: ButtonText) => {
    setEditingButtonText(buttonText)
    setButtonTextForm({ text: buttonText.text, link: buttonText.link })
    setDialogs((prev) => ({ ...prev, editButtonText: true }))
  }

  useEffect(() => {
    fetchButtonTexts()
  }, [])

  return (
    <div className="space-y-4 bg-white px-2 sm:px-4 md:px-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Button Text Management</h2>
        <Dialog open={dialogs.addButtonText} onOpenChange={(open) => setDialogs((prev) => ({ ...prev, addButtonText: open }))}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Button Text
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Button Text</DialogTitle>
              <DialogDescription>Add a new button with text and link</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="button-text">Button Text</Label>
                <Input id="button-text" value={buttonTextForm.text} onChange={(e) => setButtonTextForm((prev) => ({ ...prev, text: e.target.value }))} placeholder="Enter button text" />
              </div>
              <div>
                <Label htmlFor="button-link">Button Link</Label>
                <Input id="button-link" value={buttonTextForm.link} onChange={(e) => setButtonTextForm((prev) => ({ ...prev, link: e.target.value }))} placeholder="Enter button link URL" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddButtonText} disabled={loading.action}>
                {loading.action && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Add Button Text
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {loading.buttonTexts ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {buttonTexts.map((buttonText) => (
            <Card key={buttonText._id}>
              <CardHeader>
                <CardTitle className="text-lg">{buttonText.text}</CardTitle>
                <CardDescription className="break-all">{buttonText.link}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm" asChild>
                    <a href={buttonText.link} target="_blank" rel="noopener noreferrer">Preview</a>
                  </Button>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditButtonTextDialog(buttonText)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Button Text</AlertDialogTitle>
                          <AlertDialogDescription>Are you sure you want to delete this button text? This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteButtonText(buttonText._id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {/* Edit Button Text Dialog */}
      <Dialog open={dialogs.editButtonText} onOpenChange={(open) => setDialogs((prev) => ({ ...prev, editButtonText: open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Button Text</DialogTitle>
            <DialogDescription>Update the button text and link</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-button-text">Button Text</Label>
              <Input id="edit-button-text" value={buttonTextForm.text} onChange={(e) => setButtonTextForm((prev) => ({ ...prev, text: e.target.value }))} placeholder="Enter button text" />
            </div>
            <div>
              <Label htmlFor="edit-button-link">Button Link</Label>
              <Input id="edit-button-link" value={buttonTextForm.link} onChange={(e) => setButtonTextForm((prev) => ({ ...prev, link: e.target.value }))} placeholder="Enter button link URL" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateButtonText} disabled={loading.action}>
              {loading.action && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Update Button Text
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 