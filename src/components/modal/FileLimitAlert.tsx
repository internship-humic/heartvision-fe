"use client";

import React from "react";

interface FileLimitAlertProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FileLimitAlert({ isOpen, onClose }: FileLimitAlertProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 flex flex-col items-center text-center gap-4 z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-[#111C2D]">File Too Large</h3>
          <p className="text-sm text-[#64748B]">
            File yang Anda unggah melebihi batas ukuran maksimal. Silakan pilih file dengan ukuran maksimal 2MB.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-2 bg-[#2170FD] hover:bg-blue-600 text-white font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
        >
          Mengerti
        </button>
      </div>
    </div>
  );
}
