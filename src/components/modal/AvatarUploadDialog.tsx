"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface AvatarUploadDialogProps {
  isOpen: boolean;
  currentAvatarUrl?: string;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}

export default function AvatarUploadDialog({
  isOpen,
  currentAvatarUrl,
  onClose,
  onUpload,
}: AvatarUploadDialogProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const validateFile = (file: File): string | null => {
    if (file.size > 2 * 1024 * 1024) {
      return "File size exceeds 2MB limit.";
    }
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      return "Only JPG and PNG files are allowed.";
    }
    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError("");
    try {
      await onUpload(selectedFile);
      handleClose();
    } catch (err: any) {
      setError(err.message || "Failed to upload avatar.");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setError("");
    setIsDragging(false);
    setUploading(false);
    onClose();
  };

  const handleRemovePreview = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full border border-bgelem/40 shadow-2xl relative flex flex-col animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-bgelem/25 flex justify-between items-center bg-fbc rounded-t-2xl">
          <h3 className="text-base font-bold text-texts">Update Profile Photo</h3>
          <button
            onClick={handleClose}
            className="text-textt hover:text-rose-600 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 font-medium">
              {error}
            </div>
          )}

          {/* Current Avatar Preview */}
          {!previewUrl && currentAvatarUrl && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-textt uppercase tracking-wider">Current Photo</span>
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 bg-primary/5">
                <Image
                  src={currentAvatarUrl}
                  alt="Current Profile"
                  fill
                  unoptimized
                  className="object-cover object-top"
                />
              </div>
            </div>
          )}

          {/* Upload Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200
              ${isDragging
                ? "border-primary bg-primary/5 scale-[1.02]"
                : previewUrl
                  ? "border-green-300 bg-green-50/50"
                  : "border-bgelem/50 bg-slate-50/50 hover:border-primary/40 hover:bg-primary/[0.02]"
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleInputChange}
              className="hidden"
            />

            {previewUrl ? (
              /* Preview Mode */
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary/30 shadow-lg">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    unoptimized
                    className="object-cover object-top"
                  />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-xs font-semibold text-texts">{selectedFile?.name}</p>
                  <p className="text-[10px] text-textt">
                    {selectedFile && (selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePreview();
                  }}
                  className="text-[10px] text-rose-500 hover:text-rose-700 font-semibold transition-colors underline underline-offset-2"
                >
                  Remove & choose another
                </button>
              </div>
            ) : (
              /* Upload Placeholder Mode */
              <>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-texts">
                    Drag & drop your photo here
                  </p>
                  <p className="text-[10px] text-textt mt-1">
                    or <span className="text-primary font-semibold">click to browse</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] text-textt bg-slate-100 px-2 py-0.5 rounded-full font-medium">JPG</span>
                  <span className="text-[9px] text-textt bg-slate-100 px-2 py-0.5 rounded-full font-medium">PNG</span>
                  <span className="text-[9px] text-textt bg-slate-100 px-2 py-0.5 rounded-full font-medium">Max 2MB</span>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 border border-bgelem/50 text-textt hover:bg-slate-50 font-bold rounded-xl py-3 text-xs transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="flex-1 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl py-3 text-xs transition-all shadow-md shadow-primary/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  Upload Photo
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
