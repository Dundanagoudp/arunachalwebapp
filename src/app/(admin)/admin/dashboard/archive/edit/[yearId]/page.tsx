"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { updateYear, getImagesByYear } from "@/service/archive"

export default function EditYearPage() {
  const router = useRouter()
  const params = useParams()
  const yearId = params.yearId as string

  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [yearData, setYearData] = useState<any>(null)
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: 1,
    totalDays: 30,
  })

  useEffect(() => {
    if (yearId) {
      fetchYearData()
    }
  }, [yearId])

  const fetchYearData = async () => {
    try {
      setFetchLoading(true)
      const result = await getImagesByYear(yearId)

      if (result.success && result.data?.archive && result.data.archive.length > 0) {
        const firstImage = result.data.archive[0]
        setYearData(firstImage.year_ref)
        setFormData({
          year: firstImage.year_ref.year,
          month: 1, // Default month since it's not in the response
          totalDays: 30, // Default days
        })
      } else {
        setError("Year data not found")
      }
    } catch (error: any) {
      console.error("Error fetching year data:", error)
      setError("Failed to fetch year data")
    } finally {
      setFetchLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const result = await updateYear(yearId, {
        year: formData.year.toString(),
        month: formData.month.toString(),
        totalDays: formData.totalDays.toString(),
      })

      if (result.success) {
        setSuccess(true)
        console.log("Year updated successfully:", result.data)
        setTimeout(() => {
          router.push("/admin/dashboard/archive")
        }, 2000)
      } else {
        throw new Error(result.error || "Failed to update year")
      }
    } catch (error: any) {
      console.error("Error updating year:", error)
      setError(error.message || "Failed to update year. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ]

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading year data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Year {yearData?.year}</h1>
          <p className="text-muted-foreground">Update the year configuration in your archive.</p>
        </div>
      </div>

      <div className="max-w-2xl">
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Year updated successfully! You will be redirected to the archive page shortly.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Year Details
              </CardTitle>
              <CardDescription>Update the year and configuration for your archive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", Number.parseInt(e.target.value))}
                    min="2000"
                    max="2100"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Enter the year for your archive (2000-2100)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="month">Month *</Label>
                  <Select
                    value={formData.month.toString()}
                    onValueChange={(value) => handleInputChange("month", Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value.toString()}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Select the month for this archive period</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalDays">Total Days *</Label>
                <Input
                  id="totalDays"
                  type="number"
                  value={formData.totalDays}
                  onChange={(e) => handleInputChange("totalDays", Number.parseInt(e.target.value))}
                  min="1"
                  max="366"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Update the total number of days for this archive period.
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Current Configuration</h4>
                <div className="text-sm text-blue-800">
                  <p>
                    <strong>Archive Period:</strong> {months.find((m) => m.value === formData.month)?.label}{" "}
                    {formData.year}
                  </p>
                  <p>
                    <strong>Total Days:</strong> {formData.totalDays} days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading || success}>
              {loading ? "Updating..." : success ? "Updated Successfully!" : "Update Year"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
