'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { usePathname } from 'next/navigation';
import { DynamicBreadcrumb } from "@/components/admin/DynamicBreadcrumb";
import ProtectedRoute from "@/components/auth/protected-route";

// Loading component for admin layout
function AdminLayoutLoading() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center gap-2 px-2 sm:px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin">Admin Panel</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-sm sm:text-base">Loading...</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-2 sm:gap-6 sm:p-4 md:p-6 pt-0">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48 sm:h-8 sm:w-64" />
              <Skeleton className="h-3 w-72 sm:h-4 sm:w-96" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 sm:h-10 sm:w-32" />
              <Skeleton className="h-8 w-20 sm:h-10 sm:w-32" />
            </div>
          </div>
          {/* Stats Cards Skeleton */}
          <div className="grid gap-2 sm:gap-4 grid-cols-2 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
                  <Skeleton className="h-3 w-16 sm:h-4 sm:w-24" />
                  <Skeleton className="h-3 w-3 sm:h-4 sm:w-4" />
                </CardHeader>
                <CardContent className="pt-0">
                  <Skeleton className="h-5 w-12 sm:h-8 sm:w-16 mb-1 sm:mb-2" />
                  <Skeleton className="h-2 w-20 sm:h-3 sm:w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Content Grid Skeleton */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3 sm:pb-6">
                <Skeleton className="h-4 w-24 sm:h-6 sm:w-32" />
                <Skeleton className="h-3 w-36 sm:h-4 sm:w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-2 sm:gap-3">
                      <Skeleton className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mt-1.5 sm:mt-2" />
                      <div className="flex-1 space-y-1.5 sm:space-y-2">
                        <Skeleton className="h-3 w-full sm:h-4" />
                        <Skeleton className="h-2 w-24 sm:h-3 sm:w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <Skeleton className="h-4 w-24 sm:h-6 sm:w-32" />
                <Skeleton className="h-3 w-36 sm:h-4 sm:w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2 sm:gap-3">
                      <Skeleton className="w-4 h-4 sm:w-6 sm:h-6 rounded-full" />
                      <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded-full" />
                      <div className="flex-1 space-y-1.5 sm:space-y-2">
                        <Skeleton className="h-3 w-16 sm:h-4 sm:w-24" />
                        <Skeleton className="h-2 w-24 sm:h-3 sm:w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center gap-2 px-2 sm:px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <DynamicBreadcrumb />
          </div>
        </header>
        <Suspense fallback={<AdminLayoutLoading />}>
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            {children}
          </ProtectedRoute>
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
} 