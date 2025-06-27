"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, ImageIcon, Type, MousePointer, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  addBanner,
  getBanner,
  updateBanner,
  deleteBanner,
  addText,
  getText,
  updateText,
  deleteText,
  addButtonText,
  getButtonText,
  updateButtonText,
  deleteButtonText,
} from "@/service/homeService"

interface Banner {
  _id: string
  image_url: string
  __v: number
}

interface BannerText {
  _id: string
  bannerText: string
  bannerSubText: string
  location: string
  __v: number
}

interface ButtonText {
  _id: string
  text: string
  link: string
  __v: number
}

export default function HomeManagementPage() {
  const { toast } = useToast()

  // State management
  const [banners, setBanners] = useState<Banner[]>([])
  const [bannerTexts, setBannerTexts] = useState<BannerText[]>([])
  const [buttonTexts, setButtonTexts] = useState<ButtonText[]>([])

  // Loading states
  const [loading, setLoading] = useState({
    banners: false,
    bannerTexts: false,
    buttonTexts: false,
    action: false,
  })

  // Dialog states
  const [dialogs, setDialogs] = useState({
    addBanner: false,
    editBanner: false,
    addBannerText: false,
    editBannerText: false,
    addButtonText: false,
    editButtonText: false,
  })

  // Form states
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [editingBannerText, setEditingBannerText] = useState<BannerText | null>(null)
  const [editingButtonText, setEditingButtonText] = useState<ButtonText | null>(null)

  // Form data
  const [bannerTextForm, setBannerTextForm] = useState({
    bannerText: "",
    bannerSubText: "",
    location: "Homepage",
  })

  const [buttonTextForm, setButtonTextForm] = useState({
    text: "",
    link: "",
  })

  // Fetch data functions
  const fetchBanners = async () => {
    setLoading((prev) => ({ ...prev, banners: true }))
    try {
      const response = await getBanner()
      if (response.success) {
        setBanners(Array.isArray(response.data) ? response.data : [response.data])
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to fetch banners",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch banners",
      })
    } finally {
      setLoading((prev) => ({ ...prev, banners: false }))
    }
  }

  const fetchBannerTexts = async () => {
    setLoading((prev) => ({ ...prev, bannerTexts: true }))
    try {
      const response = await getText()
      if (response.success) {
        setBannerTexts(Array.isArray(response.data) ? response.data : [response.data])
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to fetch banner texts",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch banner texts",
      })
    } finally {
      setLoading((prev) => ({ ...prev, bannerTexts: false }))
    }
  }

  const fetchButtonTexts = async () => {
    setLoading((prev) => ({ ...prev, buttonTexts: true }))
    try {
      const response = await getButtonText()
      if (response.success) {
        setButtonTexts(Array.isArray(response.data) ? response.data : [response.data])
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to fetch button texts",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch button texts",
      })
    } finally {
      setLoading((prev) => ({ ...prev, buttonTexts: false }))
    }
  }

  // CRUD operations
  const handleAddBanner = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select an image file",
      })
      return
    }

    setLoading((prev) => ({ ...prev, action: true }))
    try {
      const formData = new FormData()
      formData.append("image_url", selectedFile)

      const response = await addBanner(formData)
      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Banner added successfully",
        })
        setDialogs((prev) => ({ ...prev, addBanner: false }))
        setSelectedFile(null)
        fetchBanners()
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to add banner",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add banner",
      })
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const handleUpdateBanner = async () => {
    if (!editingBanner || !selectedFile) {
      toast({
        title: "Error",
        description: "Please select an image file",
      })
      return
    }

    setLoading((prev) => ({ ...prev, action: true }))
    try {
      const formData = new FormData()
      formData.append("image_url", selectedFile)

      const response = await updateBanner(editingBanner._id, formData)
      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Banner updated successfully",
        })
        setDialogs((prev) => ({ ...prev, editBanner: false }))
        setSelectedFile(null)
        setEditingBanner(null)
        fetchBanners()
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update banner",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update banner",
      })
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const handleDeleteBanner = async (bannerId: string) => {
    setLoading((prev) => ({ ...prev, action: true }))
    try {
      const response = await deleteBanner(bannerId)
      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Banner deleted successfully",
        })
        fetchBanners()
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete banner",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete banner",
      })
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const handleAddBannerText = async () => {
    if (!bannerTextForm.bannerText.trim()) {
      toast({
        title: "Error",
        description: "Banner text is required",
      })
      return
    }

    setLoading((prev) => ({ ...prev, action: true }))
    try {
      const response = await addText(bannerTextForm)
      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Banner text added successfully",
        })
        setDialogs((prev) => ({ ...prev, addBannerText: false }))
        setBannerTextForm({ bannerText: "", bannerSubText: "", location: "Homepage" })
        fetchBannerTexts()
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to add banner text",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add banner text",
      })
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const handleUpdateBannerText = async () => {
    if (!editingBannerText || !bannerTextForm.bannerText.trim()) {
      toast({
        title: "Error",
        description: "Banner text is required",
      })
      return
    }

    setLoading((prev) => ({ ...prev, action: true }))
    try {
      const response = await updateText(editingBannerText._id, bannerTextForm)
      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Banner text updated successfully",
        })
        setDialogs((prev) => ({ ...prev, editBannerText: false }))
        setBannerTextForm({ bannerText: "", bannerSubText: "", location: "Homepage" })
        setEditingBannerText(null)
        fetchBannerTexts()
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update banner text",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update banner text",
      })
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const handleDeleteBannerText = async (textId: string) => {
    setLoading((prev) => ({ ...prev, action: true }))
    try {
      const response = await deleteText(textId)
      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Banner text deleted successfully",
        })
        fetchBannerTexts()
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete banner text",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete banner text",
      })
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const handleAddButtonText = async () => {
    if (!buttonTextForm.text.trim() || !buttonTextForm.link.trim()) {
      toast({
        title: "Error",
        description: "Both text and link are required",
      })
      return
    }

    setLoading((prev) => ({ ...prev, action: true }))
    try {
      const response = await addButtonText(buttonTextForm)
      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Button text added successfully",
        })
        setDialogs((prev) => ({ ...prev, addButtonText: false }))
        setButtonTextForm({ text: "", link: "" })
        fetchButtonTexts()
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to add button text",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add button text",
      })
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const handleUpdateButtonText = async () => {
    if (!editingButtonText || !buttonTextForm.text.trim() || !buttonTextForm.link.trim()) {
      toast({
        title: "Error",
        description: "Both text and link are required",
      })
      return
    }

    setLoading((prev) => ({ ...prev, action: true }))
    try {
      const response = await updateButtonText(editingButtonText._id, buttonTextForm)
      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Button text updated successfully",
        })
        setDialogs((prev) => ({ ...prev, editButtonText: false }))
        setButtonTextForm({ text: "", link: "" })
        setEditingButtonText(null)
        fetchButtonTexts()
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update button text",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update button text",
      })
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const handleDeleteButtonText = async (buttonId: string) => {
    setLoading((prev) => ({ ...prev, action: true }))
    try {
      const response = await deleteButtonText(buttonId)
      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Button text deleted successfully",
        })
        fetchButtonTexts()
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete button text",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete button text",
      })
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  // Helper functions
  const openEditBannerDialog = (banner: Banner) => {
    setEditingBanner(banner)
    setDialogs((prev) => ({ ...prev, editBanner: true }))
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

  const openEditButtonTextDialog = (buttonText: ButtonText) => {
    setEditingButtonText(buttonText)
    setButtonTextForm({
      text: buttonText.text,
      link: buttonText.link,
    })
    setDialogs((prev) => ({ ...prev, editButtonText: true }))
  }

  // Load data on component mount
  useEffect(() => {
    fetchBanners()
    fetchBannerTexts()
    fetchButtonTexts()
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/dashboard">Admin Panel</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Home Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Home Page Management</h1>
              <p className="text-muted-foreground">Manage banners, text content, and buttons for the home page</p>
            </div>

            <Tabs defaultValue="banners" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="banners" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Banners</span>
                </TabsTrigger>
                <TabsTrigger value="banner-text" className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  <span className="hidden sm:inline">Banner Text</span>
                </TabsTrigger>
                <TabsTrigger value="button-text" className="flex items-center gap-2">
                  <MousePointer className="h-4 w-4" />
                  <span className="hidden sm:inline">Button Text</span>
                </TabsTrigger>
              </TabsList>

              {/* Banners Tab */}
              <TabsContent value="banners" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Banner Management</h2>
                  <Dialog
                    open={dialogs.addBanner}
                    onOpenChange={(open) => setDialogs((prev) => ({ ...prev, addBanner: open }))}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Banner
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Banner</DialogTitle>
                        <DialogDescription>Upload a new banner image for the home page</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="banner-file">Banner Image</Label>
                          <Input
                            id="banner-file"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddBanner} disabled={loading.action || !selectedFile}>
                          {loading.action && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                          Add Banner
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {loading.banners ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {banners.map((banner) => (
                      <Card key={banner._id}>
                        <CardHeader className="pb-2">
                          <div className="aspect-video relative overflow-hidden rounded-md">
                            <img
                              src={banner.image_url || "/placeholder.svg"}
                              alt="Banner"
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">ID: {banner._id.slice(-8)}</p>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => openEditBannerDialog(banner)}>
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
                                    <AlertDialogTitle>Delete Banner</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this banner? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteBanner(banner._id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
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

                {/* Edit Banner Dialog */}
                <Dialog
                  open={dialogs.editBanner}
                  onOpenChange={(open) => setDialogs((prev) => ({ ...prev, editBanner: open }))}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Banner</DialogTitle>
                      <DialogDescription>Upload a new image to replace the current banner</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {editingBanner && (
                        <div className="aspect-video relative overflow-hidden rounded-md">
                          <img
                            src={editingBanner.image_url || "/placeholder.svg"}
                            alt="Current Banner"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}
                      <div>
                        <Label htmlFor="edit-banner-file">New Banner Image</Label>
                        <Input
                          id="edit-banner-file"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleUpdateBanner} disabled={loading.action || !selectedFile}>
                        {loading.action && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Update Banner
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TabsContent>

              {/* Banner Text Tab */}
              <TabsContent value="banner-text" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Banner Text Management</h2>
                  <Dialog
                    open={dialogs.addBannerText}
                    onOpenChange={(open) => setDialogs((prev) => ({ ...prev, addBannerText: open }))}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Banner Text
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
                          <Input
                            id="banner-text"
                            value={bannerTextForm.bannerText}
                            onChange={(e) => setBannerTextForm((prev) => ({ ...prev, bannerText: e.target.value }))}
                            placeholder="Enter main banner text"
                          />
                        </div>
                        <div>
                          <Label htmlFor="banner-subtext">Banner Subtext</Label>
                          <Textarea
                            id="banner-subtext"
                            value={bannerTextForm.bannerSubText}
                            onChange={(e) => setBannerTextForm((prev) => ({ ...prev, bannerSubText: e.target.value }))}
                            placeholder="Enter banner subtext"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={bannerTextForm.location}
                            onChange={(e) => setBannerTextForm((prev) => ({ ...prev, location: e.target.value }))}
                            placeholder="Enter location"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddBannerText} disabled={loading.action}>
                          {loading.action && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                          Add Banner Text
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
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this banner text? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteBannerText(bannerText._id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
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
                <Dialog
                  open={dialogs.editBannerText}
                  onOpenChange={(open) => setDialogs((prev) => ({ ...prev, editBannerText: open }))}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Banner Text</DialogTitle>
                      <DialogDescription>Update the banner text content</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="edit-banner-text">Banner Text</Label>
                        <Input
                          id="edit-banner-text"
                          value={bannerTextForm.bannerText}
                          onChange={(e) => setBannerTextForm((prev) => ({ ...prev, bannerText: e.target.value }))}
                          placeholder="Enter main banner text"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-banner-subtext">Banner Subtext</Label>
                        <Textarea
                          id="edit-banner-subtext"
                          value={bannerTextForm.bannerSubText}
                          onChange={(e) => setBannerTextForm((prev) => ({ ...prev, bannerSubText: e.target.value }))}
                          placeholder="Enter banner subtext"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-location">Location</Label>
                        <Input
                          id="edit-location"
                          value={bannerTextForm.location}
                          onChange={(e) => setBannerTextForm((prev) => ({ ...prev, location: e.target.value }))}
                          placeholder="Enter location"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleUpdateBannerText} disabled={loading.action}>
                        {loading.action && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Update Banner Text
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TabsContent>

              {/* Button Text Tab */}
              <TabsContent value="button-text" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Button Text Management</h2>
                  <Dialog
                    open={dialogs.addButtonText}
                    onOpenChange={(open) => setDialogs((prev) => ({ ...prev, addButtonText: open }))}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Button Text
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
                          <Input
                            id="button-text"
                            value={buttonTextForm.text}
                            onChange={(e) => setButtonTextForm((prev) => ({ ...prev, text: e.target.value }))}
                            placeholder="Enter button text"
                          />
                        </div>
                        <div>
                          <Label htmlFor="button-link">Button Link</Label>
                          <Input
                            id="button-link"
                            value={buttonTextForm.link}
                            onChange={(e) => setButtonTextForm((prev) => ({ ...prev, link: e.target.value }))}
                            placeholder="Enter button link URL"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddButtonText} disabled={loading.action}>
                          {loading.action && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                          Add Button Text
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
                              <a href={buttonText.link} target="_blank" rel="noopener noreferrer">
                                Preview
                              </a>
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
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this button text? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteButtonText(buttonText._id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
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
                <Dialog
                  open={dialogs.editButtonText}
                  onOpenChange={(open) => setDialogs((prev) => ({ ...prev, editButtonText: open }))}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Button Text</DialogTitle>
                      <DialogDescription>Update the button text and link</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="edit-button-text">Button Text</Label>
                        <Input
                          id="edit-button-text"
                          value={buttonTextForm.text}
                          onChange={(e) => setButtonTextForm((prev) => ({ ...prev, text: e.target.value }))}
                          placeholder="Enter button text"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-button-link">Button Link</Label>
                        <Input
                          id="edit-button-link"
                          value={buttonTextForm.link}
                          onChange={(e) => setButtonTextForm((prev) => ({ ...prev, link: e.target.value }))}
                          placeholder="Enter button link URL"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleUpdateButtonText} disabled={loading.action}>
                        {loading.action && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Update Button Text
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
