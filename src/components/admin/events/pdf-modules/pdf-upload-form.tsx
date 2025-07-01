"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Loader2 } from 'lucide-react';
import { addPdf } from "@/service/addPdfServices";

interface PdfUploadFormProps {
  onSuccess?: () => void;
}

export function PdfUploadForm({ onSuccess }: PdfUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file.",
        });
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB.",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to upload.",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const result = await addPdf(formData);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        setFile(null);
        // Reset the file input
        const fileInput = document.getElementById("pdf-file") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        onSuccess?.();
      } else {
        toast({
          title: "Upload failed",
          description: result.error,
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-2 sm:p-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Upload className="h-5 w-5" />
          Upload PDF
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Upload a new event brochure PDF file
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pdf-file" className="text-sm sm:text-base">PDF File</Label>
            <Input
              id="pdf-file"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={isUploading}
              className="text-xs sm:text-sm"
            />
            {file && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>{file.name}</span>
                <span>({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            )}
          </div>
          <Button type="submit" disabled={!file || isUploading} className="w-full text-xs sm:text-base">
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload PDF
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
