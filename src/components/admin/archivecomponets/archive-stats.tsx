"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, ImageIcon, Clock, Archive, TrendingUp } from "lucide-react"

interface ArchiveStatsProps {
  totalYears: number
  totalDays: number
  totalImages: number
  latestYear: number
  selectedCount?: number
}

export function ArchiveStats({ totalYears, totalDays, totalImages, latestYear, selectedCount = 0 }: ArchiveStatsProps) {
  return (
    <div className="grid gap-2 sm:gap-4 grid-cols-2 md:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total Years</CardTitle>
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-lg sm:text-2xl font-bold">{totalYears}</div>
          <p className="text-xs text-muted-foreground">Archive years</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total Images</CardTitle>
          <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-lg sm:text-2xl font-bold">{totalImages}</div>
          <p className="text-xs text-muted-foreground">Archived images</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total Days</CardTitle>
          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-lg sm:text-2xl font-bold">{totalDays}</div>
          <p className="text-xs text-muted-foreground">Archive days</p>
        </CardContent>
      </Card>

      <Card className="col-span-2 md:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Latest Year</CardTitle>
          <Archive className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-lg sm:text-2xl font-bold">{latestYear || "N/A"}</div>
          <p className="text-xs text-muted-foreground">Most recent</p>
        </CardContent>
      </Card>

      <Card className="col-span-2 md:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Selected</CardTitle>
          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-lg sm:text-2xl font-bold">{selectedCount}</div>
          <p className="text-xs text-muted-foreground">Images selected</p>
        </CardContent>
      </Card>
    </div>
  )
}
