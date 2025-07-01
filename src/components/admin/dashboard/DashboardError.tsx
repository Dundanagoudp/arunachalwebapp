import React from "react";

type DashboardErrorProps = {
  message: string;
};

const DashboardError = ({ message }: DashboardErrorProps) => (
  <div className="flex flex-1 items-center justify-center p-8">
    <div className="bg-red-100 text-red-700 px-6 py-4 rounded shadow text-lg font-semibold text-center">
      {message}
    </div>
  </div>
);

export default DashboardError; 