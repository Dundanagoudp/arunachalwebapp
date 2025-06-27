import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { addText, getText, updateText, deleteText } from "@/service/homeService"

interface BannerText {
  _id: string
  bannerText: string
  bannerSubText: string
  location: string
  __v: number
}

export default function BannerTextSection() {
  const { toast } = useToast()
  const [bannerTexts, setBannerTexts] = useState<BannerText[]>([])
  const [loading, setLoading] = useState({ bannerTexts: false, action: false })
  const [dialogs, setDialogs] = useState({ addBannerText: false, editBannerText: false })
  const [editingBannerText, setEditingBannerText] = useState<BannerText | null>(null)
  const [bannerTextForm, setBannerTextForm] = useState({ bannerText: "", bannerSubText: "", location: "Homepage" })

  const fetchBannerTexts = async () => {
    setLoading((prev) => ({ ...prev, bannerTexts: true }))
    try {
      const response = await getText()
      if (response.success) {
        setBannerTexts(Array.isArray(response.data) ? response.data : [response.data])
      } else {
        toast({ title: "Error", description: response.error || "Failed to fetch banner texts" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch banner texts" })
    } finally {
      setLoading((prev) => ({ ...prev, bannerTexts: false }))
    }
  }

  const handleAddBannerText = async () => {
    if (!bannerTextForm.bannerText.trim()) {
      toast({ title: "Error", description: "Banner text is required" })
      return
    }
    setLoading((prev) => ({ ...prev, action: true }))
    try {
      const response = await addText(bannerTextForm)
      if (response.success) {
        toast({ title: "Success", description: response.message || "Banner text added successfully" })
        setDialogs((prev) => ({ ...prev, addBannerText: false }))
        setBannerTextForm({ bannerText: "", bannerSubText: "", location: "Homepage" })
        fetchBannerTexts()
      } else {
        toast({ title: "Error", description: response.error || "Failed to add banner text" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to add banner text" })
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const handleUpdateBannerText = async () => {
    if (!editingBannerText || !bannerTextForm.bannerText.trim()) {
      toast({ title: "Error", description: "Banner text is required" })
      return
    }
    setLoading((prev) => ({ ...prev, action: true }))
    try {
      const response = await updateText(editingBannerText._id, bannerTextForm)
      if (response.success) {
        toast({ title: "Success", description: response.message || "Banner text updated successfully" })
        setDialogs((prev) => ({ ...prev, editBannerText: false }))
        setBannerTextForm({ bannerText: "", bannerSubText: "", location: "Homepage" })
        setEditingBannerText(null)
        fetchBannerTexts()
      } else {
        toast({ title: "Error", description: response.error || "Failed to update banner text" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update banner text" })
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const handleDeleteBannerText = async (textId: string) => {
    setLoading((prev) => ({ ...prev, action: true }))
    try {
      const response = await deleteText(textId)
      if (response.success) {
        toast({ title: "Success", description: response.message || "Banner text deleted successfully" })
        fetchBannerTexts()
      } else {
        toast({ title: "Error", description: response.error || "Failed to delete banner text" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete banner text" })
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const openEditBannerTextDialog = (bannerText: BannerText) => {
    setEditingBannerText(bannerText)
    setBannerTextForm({
      bannerText: bannerText.bannerText,
      bannerSubText: bannerText.bannerSubText,
      location: bannerText.location,
    })
    setDialogs((prev) => ({ ...prev, editBannerText: true }))
  }

  useEffect(() => {
    fetchBannerTexts()
  }, [])

  return (
    <div className="space-y-4 bg-white px-2 sm:px-4 md:px-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Banner Text Management</h2>
        <Dialog open={dialogs.addBannerText} onOpenChange={(open) => setDialogs((prev) => ({ ...prev, addBannerText: open }))}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Banner Text
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Banner Text</DialogTitle>
              <DialogDescription>Add text content for the banner section</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="banner-text">Banner Text</Label>
                <Input id="banner-text" value={bannerTextForm.bannerText} onChange={(e) => setBannerTextForm((prev) => ({ ...prev, bannerText: e.target.value }))} placeholder="Enter main banner text" />
              </div>
              <div>
                <Label htmlFor="banner-subtext">Banner Subtext</Label>
                <Textarea id="banner-subtext" value={bannerTextForm.bannerSubText} onChange={(e) => setBannerTextForm((prev) => ({ ...prev, bannerSubText: e.target.value }))} placeholder="Enter banner subtext" />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={bannerTextForm.location} onChange={(e) => setBannerTextForm((prev) => ({ ...prev, location: e.target.value }))} placeholder="Enter location" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddBannerText} disabled={loading.action}>
                {loading.action && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Add Banner Text
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {loading.bannerTexts ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bannerTexts.map((bannerText) => (
            <Card key={bannerText._id}>
              <CardHeader>
                <CardTitle className="text-lg">{bannerText.bannerText}</CardTitle>
                <CardDescription>{bannerText.bannerSubText}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Location: {bannerText.location}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditBannerTextDialog(bannerText)}>
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
                          <AlertDialogTitle>Delete Banner Text</AlertDialogTitle>
                          <AlertDialogDescription>Are you sure you want to delete this banner text? This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteBannerText(bannerText._id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
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
      {/* Edit Banner Text Dialog */}
      <Dialog open={dialogs.editBannerText} onOpenChange={(open) => setDialogs((prev) => ({ ...prev, editBannerText: open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Banner Text</DialogTitle>
            <DialogDescription>Update the banner text content</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-banner-text">Banner Text</Label>
              <Input id="edit-banner-text" value={bannerTextForm.bannerText} onChange={(e) => setBannerTextForm((prev) => ({ ...prev, bannerText: e.target.value }))} placeholder="Enter main banner text" />
            </div>
            <div>
              <Label htmlFor="edit-banner-subtext">Banner Subtext</Label>
              <Textarea id="edit-banner-subtext" value={bannerTextForm.bannerSubText} onChange={(e) => setBannerTextForm((prev) => ({ ...prev, bannerSubText: e.target.value }))} placeholder="Enter banner subtext" />
            </div>
            <div>
              <Label htmlFor="edit-location">Location</Label>
              <Input id="edit-location" value={bannerTextForm.location} onChange={(e) => setBannerTextForm((prev) => ({ ...prev, location: e.target.value }))} placeholder="Enter location" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateBannerText} disabled={loading.action}>
              {loading.action && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Update Banner Text
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 