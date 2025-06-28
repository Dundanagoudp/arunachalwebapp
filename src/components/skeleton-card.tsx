import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Workshop card skeleton
export function WorkshopCardSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row items-start gap-4 p-4 border rounded-lg">
      <Skeleton className="w-full lg:w-32 h-32 lg:h-24 rounded-md flex-shrink-0" />
      <div className="flex-1 space-y-2 w-full lg:w-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </div>
  )
}

// Workshop list skeleton
export function WorkshopListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <WorkshopCardSkeleton key={index} />
      ))}
    </div>
  )
}

// Stats cards skeleton
export function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Form skeleton
export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-32 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-32 w-full max-w-md" />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}

// Search skeleton
export function SearchSkeleton() {
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

// Page header skeleton
export function PageHeaderSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  )
}
