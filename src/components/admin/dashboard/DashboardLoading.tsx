import React from "react";

const DashboardLoading = () => (
  <div className="flex flex-1 flex-col gap-4 p-6 pt-0">
    {/* Header Skeleton */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2 mb-4">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-96 bg-gray-100 rounded animate-pulse" />
      </div>
      <div className="flex gap-2">
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
    {/* Stats Cards Skeleton */}
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-4 bg-gray-100 rounded shadow animate-pulse">
          <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
          <div className="h-8 w-16 bg-gray-200 rounded mb-1" />
          <div className="h-3 w-32 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
    {/* Content Grid Skeleton */}
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-6 bg-gray-100 rounded shadow animate-pulse space-y-3">
          <div className="h-6 w-1/2 bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-100 rounded" />
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  </div>
);

export default DashboardLoading; 