"use client"
import { FileUpload } from "@/components/ui/file-upload"
import { useState } from "react"

interface UploadResumeProps {
  onFileUpload?: (files: File[]) => void
}

function UploadResume({ onFileUpload }: UploadResumeProps) {
  const [files, setFiles] = useState<File[]>([])

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles)
    if (onFileUpload) {
      onFileUpload(uploadedFiles)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
      <FileUpload onChange={handleFileUpload} />
    </div>
  )
}

export default UploadResume
