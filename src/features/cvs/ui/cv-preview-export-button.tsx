"use client";

import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { toast } from "@/shared/ui/toast";

import { exportCvPdfAction } from "../api/cv-preview.actions";

function downloadPdf(base64: string, fileName: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  const url = URL.createObjectURL(
    new Blob([bytes], { type: "application/pdf" }),
  );
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

type Props = {
  cvId: string;
  disabled?: boolean;
};

export function CvPreviewExportButton({ cvId, disabled = false }: Props) {
  const [isExporting, setIsExporting] = useState(false);

  async function handleExport() {
    setIsExporting(true);

    try {
      const result = await exportCvPdfAction(cvId);

      if (!result.success) {
        toast.add({
          type: "error",
          title: "Could not export the CV",
          description: result.error,
        });
        return;
      }

      downloadPdf(result.base64, result.fileName);
      toast.add({
        type: "success",
        title: "CV exported",
        description: `${result.fileName} has been downloaded.`,
      });
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled || isExporting}
      aria-busy={isExporting}
      onClick={handleExport}
    >
      Export PDF
    </Button>
  );
}
