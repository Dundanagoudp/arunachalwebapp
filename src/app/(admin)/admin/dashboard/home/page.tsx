"use client"

import { useState, useEffect } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import BannersSection from '@/components/admin/home/BannersSection'
import BannerTextSection from '@/components/admin/home/BannerTextSection'
import ButtonTextSection from '@/components/admin/home/ButtonTextSection'

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
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-white min-h-screen">
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
          <BannersSection />
        </TabsContent>

        {/* Banner Text Tab */}
        <TabsContent value="banner-text" className="space-y-4">
          <BannerTextSection />
        </TabsContent>

        {/* Button Text Tab */}
        <TabsContent value="button-text" className="space-y-4">
          <ButtonTextSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}
