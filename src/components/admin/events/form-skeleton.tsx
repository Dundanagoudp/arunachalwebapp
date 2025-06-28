import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Form Header Skeleton
export function FormHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-80" />
      </div>
      <Skeleton className="h-10 w-24" />
    </div>
  )
}

// Form Field Skeleton
export function FormFieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

// Textarea Field Skeleton
export function TextareaFieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-24 w-full" />
    </div>
  )
}

// Date Field Skeleton
export function DateFieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

// Select Field Skeleton
export function SelectFieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

// Form Card Skeleton
export function FormCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormFieldSkeleton />
          <FormFieldSkeleton />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <DateFieldSkeleton />
          <DateFieldSkeleton />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <SelectFieldSkeleton />
          <SelectFieldSkeleton />
        </div>
        <TextareaFieldSkeleton />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

// Time Slot Form Skeleton
export function TimeSlotFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormFieldSkeleton />
          <SelectFieldSkeleton />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormFieldSkeleton />
          <FormFieldSkeleton />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormFieldSkeleton />
          <FormFieldSkeleton />
        </div>
        <TextareaFieldSkeleton />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

// Full Form Page Skeleton
export function FormPageSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      <FormHeaderSkeleton />
      <FormCardSkeleton />
    </div>
  )
}

// Time Slot Page Skeleton
export function TimeSlotPageSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      <FormHeaderSkeleton />
      <TimeSlotFormSkeleton />
    </div>
  )
} 