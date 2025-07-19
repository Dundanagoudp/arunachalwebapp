"use client";

import { useToast } from "@/components/ui/custom-toast";
import { Button } from "@/components/ui/button";

export function ToastDemo() {
  const { showToast } = useToast();
  
  const handleSuccess = () => {
    showToast("Successfully submitted!", "success");
  };
  
  const handleError = () => {
    showToast("Something went wrong!", "error");
  };
  
  const handleWarning = () => {
    showToast("Please check your input!", "warning");
  };
  
  const handleInfo = () => {
    showToast("Here's some information for you!", "success");
  };
  
  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-lg font-semibold">Toast Demo</h2>
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleSuccess} variant="default">
          Success Toast
        </Button>
        <Button onClick={handleError} variant="destructive">
          Error Toast
        </Button>
        <Button onClick={handleWarning} variant="outline">
          Warning Toast
        </Button>
        <Button onClick={handleInfo} variant="secondary">
          Info Toast
        </Button>
      </div>
    </div>
  );
} 