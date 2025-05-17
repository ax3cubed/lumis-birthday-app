"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, Check } from "lucide-react"

interface MediaUploaderProps {
  onUpload: (file: File) => void
  accept: string
  maxSize?: number // in MB
}

export default function MediaUploader({ onUpload, accept, maxSize = 10 }: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    setError(null)
    setSuccess(false)

    // Check file type
    if (!file.type.match(accept.replace(/,/g, "|").replace(/\*/g, ".*"))) {
      setError(`Invalid file type. Please upload ${accept} files.`)
      return
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File too large. Maximum size is ${maxSize}MB.`)
      return
    }

    // Upload successful
    onUpload(file)
    setSuccess(true)

    // Reset after 3 seconds
    setTimeout(() => {
      setSuccess(false)
    }, 3000)
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-blue-400 bg-blue-50/10"
            : success
              ? "border-green-400 bg-green-50/10"
              : error
                ? "border-red-400 bg-red-50/10"
                : "border-gray-300 hover:border-gray-400 bg-gray-50/5 hover:bg-gray-50/10"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileInput} accept={accept} className="hidden" />

        <div className="flex flex-col items-center justify-center space-y-2">
          {success ? (
            <>
              <div className="w-12 h-12 rounded-full bg-green-100/20 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-sm text-green-500">Upload successful!</p>
            </>
          ) : error ? (
            <>
              <div className="w-12 h-12 rounded-full bg-red-100/20 flex items-center justify-center">
                <X className="h-6 w-6 text-red-500" />
              </div>
              <p className="text-sm text-red-500">{error}</p>
              <p className="text-xs text-gray-400">Click to try again</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-gray-100/20 flex items-center justify-center">
                <Upload className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-300">Drag and drop your media here, or click to browse</p>
              <p className="text-xs text-gray-400">
                Supports {accept.split(",").join(", ")} (Max: {maxSize}MB)
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
