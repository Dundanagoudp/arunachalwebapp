import React from "react";

type DashboardErrorProps = {
  message: string;
};

const DashboardError = ({ message }: DashboardErrorProps) => (
  <div className="p-8 text-center text-red-500">{message}</div>
);

export default DashboardError; 