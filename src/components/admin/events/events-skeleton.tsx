import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Clock, Users } from "lucide-react"

// Stats Cards Skeleton
export function EventsStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-8 mb-1" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-20" />
          <Clock className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-8 mb-1" />
          <Skeleton className="h-3 w-24" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-20" />
          <Users className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-8 mb-1" />
          <Skeleton className="h-3 w-28" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Calendar className="h-4 w-4 text-gray-600" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-8 mb-1" />
          <Skeleton className="h-3 w-28" />
        </CardContent>
      </Card>
    </div>
  )
}

// Event Details Skeleton
export function EventDetailsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-96" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Search Skeleton
export function SearchSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <div className="flex-1">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Event Days List Skeleton
export function EventDaysListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-96 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="flex gap-2 items-center">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <Skeleton className="h-4 w-20" />
                <div className="grid gap-2 md:grid-cols-2">
                  {[1, 2].map((j) => (
                    <div key={j} className="bg-muted p-3 rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <Skeleton className="h-3 w-48 mb-2" />
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-6 w-12" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Header Skeleton
export function EventsHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  )
}

// Full Page Skeleton
export function EventsPageSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      <EventsHeaderSkeleton />
      <EventsStatsSkeleton />
      <EventDetailsSkeleton />
      <SearchSkeleton />
      <EventDaysListSkeleton />
    </div>
  )
} 