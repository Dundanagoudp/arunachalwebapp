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
import { useDeletePermission } from "@/hooks/use-delete-permission"
import { ContactAdminModal } from "@/components/ui/contact-admin-modal"

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
  onDeleteYear?: () => void
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
  onDeleteYear,
}: ArchiveFiltersProps) {
  const { isAdmin } = useDeletePermission()
  const [availableYears, setAvailableYears] = useState<ArchiveYear[]>([])
  const [availableDays, setAvailableDays] = useState<ArchiveDay[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAvailableYears()
  }, [])

  useEffect(() => {
    if (yearFilter && yearFilter !== "all") {
      const selectedYear = availableYears.find((year) => year._id === yearFilter)
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
      <CardHeader className="pb-3 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters & Controls</span>
            <span className="sm:hidden">Filters</span>
          </CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewModeChange(viewMode === "grid" ? "list" : "grid")}
              className="text-xs sm:text-sm"
            >
              {viewMode === "grid" ? <List className="h-3 w-3 sm:h-4 sm:w-4" /> : <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />}
            </Button>
            {selectedCount > 0 && (
              isAdmin ? (
                <Button variant="destructive" size="sm" onClick={onBulkDelete} className="text-xs sm:text-sm">
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Delete Selected ({selectedCount})</span>
                  <span className="sm:hidden">Delete ({selectedCount})</span>
                </Button>
              ) : (
                <ContactAdminModal
                  title="Delete Images Access Denied"
                  description="You don't have permission to delete images. Please contact the administrator for assistance."
                >
                  <Button variant="destructive" size="sm" className="text-xs sm:text-sm">
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Delete Selected ({selectedCount})</span>
                    <span className="sm:hidden">Delete ({selectedCount})</span>
                  </Button>
                </ContactAdminModal>
              )
            )}
            {onDeleteYear && yearFilter !== "all" && (
              isAdmin ? (
                <Button variant="destructive" size="sm" onClick={onDeleteYear} className="text-xs sm:text-sm">
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Delete Year</span>
                  <span className="sm:hidden">Delete Year</span>
                </Button>
              ) : (
                <ContactAdminModal
                  title="Delete Year Access Denied"
                  description="You don't have permission to delete years. Please contact the administrator for assistance."
                >
                  <Button variant="destructive" size="sm" className="text-xs sm:text-sm">
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Delete Year</span>
                    <span className="sm:hidden">Delete Year</span>
                  </Button>
                </ContactAdminModal>
              )
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:gap-4 md:items-end">
          <div className="flex-1 w-full">
            <Label htmlFor="search" className="text-xs sm:text-sm">Search archive</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by year or day..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-6 sm:pl-8 w-full text-xs sm:text-sm"
              />
            </div>
          </div>
          <div className="w-full md:w-auto">
            <Label htmlFor="year" className="text-xs sm:text-sm">Year</Label>
            <Select value={yearFilter} onValueChange={onYearFilterChange} disabled={loading}>
              <SelectTrigger className="w-full md:w-[180px] lg:w-[200px] text-xs sm:text-sm">
                <SelectValue placeholder={loading ? "Loading..." : "All Years"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {availableYears.map((yearData) => (
                  <SelectItem key={yearData._id} value={yearData._id} className="text-xs sm:text-sm">
                    <span className="hidden sm:inline">
                      {yearData.year} - {getMonthName(yearData.month)} ({yearData.days?.length || 0} days)
                    </span>
                    <span className="sm:hidden">
                      {yearData.year} ({yearData.days?.length || 0} days)
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-auto">
            <Label htmlFor="day" className="text-xs sm:text-sm">Day</Label>
            <Select
              value={dayFilter}
              onValueChange={onDayFilterChange}
              disabled={!yearFilter || yearFilter === "all" || availableDays.length === 0}
            >
              <SelectTrigger className="w-full md:w-[130px] lg:w-[150px] text-xs sm:text-sm">
                <SelectValue placeholder="All Days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Days</SelectItem>
                {availableDays.map((day) => (
                  <SelectItem key={day._id} value={day._id} className="text-xs sm:text-sm">
                    {day.dayLabel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto md:justify-end">
            <Checkbox
              id="selectAll"
              checked={selectedCount === totalCount && totalCount > 0}
              onCheckedChange={onSelectAll}
              className="h-3 w-3 sm:h-4 sm:w-4"
            />
            <Label htmlFor="selectAll" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Select All ({totalCount})</span>
              <span className="sm:hidden">All ({totalCount})</span>
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
