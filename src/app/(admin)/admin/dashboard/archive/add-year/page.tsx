"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, AlertCircle, CheckCircle } from "lucide-react"
import { addYear } from "@/service/archive"

export default function AddYearPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: 1,
    totalDays: 30,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const result = await addYear({
        year: formData.year.toString(),
        month: formData.month.toString(),
        totalDays: formData.totalDays.toString(),
      })

      if (result.success) {
        setSuccess(true)
        console.log("Year created successfully:", result.data)
        setTimeout(() => {
          router.push("/admin/dashboard/archive")
        }, 2000)
      } else {
        throw new Error(result.error || "Failed to create year")
      }
    } catch (error: any) {
      console.error("Error creating year:", error)
      setError(error.message || "Failed to create year. Please try again.")
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

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate()
  }

  const maxDaysForMonth = getDaysInMonth(formData.year, formData.month)

  return (
    <div className="flex flex-1 flex-col gap-4 p-2 sm:gap-6 sm:p-4 md:p-6 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Add New Year</h1>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base">Create a new year in your archive with specified days.</p>
        </div>
      </div>

      <div className="max-w-2xl">
        {success && (
          <Alert className="mb-4 sm:mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 text-sm">
              Year created successfully! You will be redirected to the archive page shortly.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4 sm:mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                Year Details
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Configure the year and number of days for your archive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="year" className="text-xs sm:text-sm">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", Number.parseInt(e.target.value))}
                    min="2000"
                    max="2100"
                    required
                    className="text-xs sm:text-sm"
                  />
                  <p className="text-xs text-muted-foreground">Enter the year for your archive (2000-2100)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="month" className="text-xs sm:text-sm">Month *</Label>
                  <Select
                    value={formData.month.toString()}
                    onValueChange={(value) => handleInputChange("month", Number.parseInt(value))}
                  >
                    <SelectTrigger className="text-xs sm:text-sm">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value.toString()} className="text-xs sm:text-sm">
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Select the month for this archive period</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalDays" className="text-xs sm:text-sm">Total Days *</Label>
                <Input
                  id="totalDays"
                  type="number"
                  value={formData.totalDays}
                  onChange={(e) => handleInputChange("totalDays", Number.parseInt(e.target.value))}
                  min="1"
                  max="366"
                  required
                  className="text-xs sm:text-sm"
                />
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    This will create {formData.totalDays} days (Day 1, Day 2, ... Day {formData.totalDays}) for{" "}
                    {months.find((m) => m.value === formData.month)?.label} {formData.year}.
                  </p>
                  <p className="text-xs text-blue-600">
                    Suggested: {maxDaysForMonth} days for {months.find((m) => m.value === formData.month)?.label}{" "}
                    {formData.year}
                  </p>
                </div>
              </div>


            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
            <Button type="submit" disabled={loading || success} size="sm" className="text-xs sm:text-sm">
              {loading ? "Creating..." : success ? "Created Successfully!" : "Create Year"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading} size="sm" className="text-xs sm:text-sm">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
