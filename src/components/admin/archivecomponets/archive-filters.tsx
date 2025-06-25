"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, Grid3X3, List, Trash2 } from "lucide-react"

interface ArchiveFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  yearFilter: string
  onYearFilterChange: (value: string) => void
  availableYears: number[]
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
  availableYears,
  viewMode,
  onViewModeChange,
  selectedCount,
  totalCount,
  onSelectAll,
  onBulkDelete,
}: ArchiveFiltersProps) {
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
            <Select value={yearFilter} onValueChange={onYearFilterChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
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
