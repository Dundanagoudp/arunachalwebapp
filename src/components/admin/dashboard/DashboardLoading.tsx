import React from "react";

const DashboardLoading = () => (
  <div className="p-8 text-center text-lg">
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto" />
      <div className="h-6 bg-gray-100 rounded w-1/2 mx-auto" />
      <div className="h-40 bg-gray-100 rounded w-full mx-auto" />
    </div>
  </div>
);

export default DashboardLoading; 