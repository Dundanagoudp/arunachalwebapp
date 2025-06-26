"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, Grid3X3, List, Trash2 } from "lucide-react"
import { getYear } from "@/service/archive"
import type { ArchiveYear, ArchiveDay } from "@/types/archive-types"

interface ArchiveFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  yearFilter: string
  onYearFilterChange: (value: string) => void
  dayFilter: string
  onDayFilterChange: (value: string) => void
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  selectedCount: number
  totalCount: number
  onSelectAll: () => void
  onBulkDelete: () => void
}

export function ArchiveFilters({
  searchTerm,
  onSearchChange,
  yearFilter,
  onYearFilterChange,
  dayFilter,
  onDayFilterChange,
  viewMode,
  onViewModeChange,
  selectedCount,
  totalCount,
  onSelectAll,
  onBulkDelete,
}: ArchiveFiltersProps) {
  const [availableYears, setAvailableYears] = useState<ArchiveYear[]>([])
  const [availableDays, setAvailableDays] = useState<ArchiveDay[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAvailableYears()
  }, [])

  useEffect(() => {
    if (yearFilter && yearFilter !== "all") {
      const selectedYear = availableYears.find((year) => year.year.toString() === yearFilter)
      if (selectedYear && selectedYear.days) {
        setAvailableDays(selectedYear.days)
      } else {
        setAvailableDays([])
      }
    } else {
      setAvailableDays([])
    }
    // Reset day filter when year changes
    onDayFilterChange("all")
  }, [yearFilter, availableYears, onDayFilterChange])

  const fetchAvailableYears = async () => {
    try {
      setLoading(true)
      const result = await getYear()
      if (result.success && result.data?.years) {
        // Sort years by year in descending order (newest first)
        const sortedYears = result.data.years.sort((a, b) => b.year - a.year)
        setAvailableYears(sortedYears)
      }
    } catch (error) {
      console.error("Error fetching years:", error)
    } finally {
      setLoading(false)
    }
  }

  const getMonthName = (monthNumber: number) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return months[monthNumber - 1] || `Month ${monthNumber}`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters & Controls
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onViewModeChange(viewMode === "grid" ? "list" : "grid")}>
              {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            </Button>
            {selectedCount > 0 && (
              <Button variant="destructive" size="sm" onClick={onBulkDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedCount})
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="search">Search archive</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by year or day..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="year">Year</Label>
            <Select value={yearFilter} onValueChange={onYearFilterChange} disabled={loading}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={loading ? "Loading..." : "All Years"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {availableYears.map((yearData) => (
                  <SelectItem key={yearData._id} value={yearData.year.toString()}>
                    {yearData.year} - {getMonthName(yearData.month)} ({yearData.days?.length || 0} days)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="day">Day</Label>
            <Select
              value={dayFilter}
              onValueChange={onDayFilterChange}
              disabled={!yearFilter || yearFilter === "all" || availableDays.length === 0}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Days</SelectItem>
                {availableDays.map((day) => (
                  <SelectItem key={day._id} value={day._id}>
                    {day.dayLabel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="selectAll"
              checked={selectedCount === totalCount && totalCount > 0}
              onCheckedChange={onSelectAll}
            />
            <Label htmlFor="selectAll" className="text-sm">
              Select All ({totalCount})
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
