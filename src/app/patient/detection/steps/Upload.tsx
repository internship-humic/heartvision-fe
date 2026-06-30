"use client";

import React, { useState } from "react";
import Image from "next/image";
import FileLimitAlert from "@/components/modal/FileLimitAlert";

interface UploadProps {
  onFileSelect: (file: File) => void;
  validationError: string | null;
  uploadedFile: File | null;
}

export default function Upload({
  onFileSelect,
  validationError,
  uploadedFile,
}: UploadProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setIsAlertOpen(true);
        e.target.value = "";
        return;
      }
      onFileSelect(file);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8 mt-4 items-start">
      <div className="lg:col-span-8 bg-white border border-[#DEE8FF] rounded-[24px] p-8 shadow-sm flex flex-col gap-6">
        <label className="border-2 border-dashed border-[#CACED1] hover:border-[#2170FD]/50 bg-white rounded-[24px] p-16 flex flex-col items-center justify-center gap-6 transition-all cursor-pointer group">
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

          <div className="w-[100px] h-[100px] bg-[#EAF2FC] rounded-full flex items-center justify-center text-[#2170FD] group-hover:scale-105 transition-transform">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
          </div>

          <div className="text-center flex flex-col gap-2">
            <h3 className="text-[26px] font-black text-[#111C2D] tracking-tight">Upload Heart X-Ray</h3>
            <p className="text-sm text-[#4B5563] font-semibold max-w-lg leading-relaxed mx-auto">
              Drag and drop your DICOM or high-resolution JPEG X-ray images here. Maximum file size: 2MB
            </p>
          </div>

          <div className="px-8 py-3 bg-[#0047AD] text-white font-black rounded-xl shadow-md shadow-[#0047AD]/10 hover:bg-[#003B95] transition-all">
            Browse Files
          </div>
        </label>

        {validationError && (
          <div className="text-rose-600 text-sm font-bold text-center bg-rose-50 p-3 rounded-xl border border-rose-100">
            {validationError}
          </div>
        )}

        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-textt">
          <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure 256-bit encrypted medical data handling
        </div>
      </div>

      {/* Right Column: Guidelines & Preview */}
      <div className="lg:col-span-4 flex flex-col gap-6">

        {/* Upload Guidelines Card */}
        <div className="border border-[#DEE8FF] rounded-[24px] border-l-[6px] border-l-[#2170FD] p-6 bg-[#EAF2FC] shadow-sm flex gap-4">
          <div className="text-[#2170FD] shrink-0 mt-0.5">
            {/* Info Circle Icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.083.984l-.04.02-1.083-.984zm.644 3h.01m-.013-6a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex flex-col gap-3 flex-1">
            <h3 className="text-base font-black text-[#2170FD] tracking-tight">Upload Guidelines</h3>
            <ul className="flex flex-col gap-3 text-xs font-bold text-[#4B5563]">
              <li className="flex gap-2 items-start">
                <svg className="w-4 h-4 text-[#2170FD] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Ensure the X-ray is in high resolution (min 1024px).</span>
              </li>
              <li className="flex gap-2 items-start">
                <svg className="w-4 h-4 text-[#2170FD] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Frontal chest view (PA) is preferred for heart detection.</span>
              </li>
              <li className="flex gap-2 items-start">
                <svg className="w-4 h-4 text-[#2170FD] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Supported formats: .DICOM, .JPG, .PNG</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white border border-[#DEE8FF] rounded-[24px] p-6 shadow-sm flex flex-col gap-4">
          <div className="w-full h-[140px] bg-slate-100 rounded-xl border border-bgelem relative overflow-hidden">
            <Image src="/scan/sample.png" alt="Sample X-Ray" fill className="object-cover" />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-black text-[#111C2D]">Sample Optimal View</h4>
            <p className="text-xs font-semibold text-[#64748B]">Properly aligned PA view for best AI results.</p>
          </div>
        </div>

      </div>

      <FileLimitAlert isOpen={isAlertOpen} onClose={() => setIsAlertOpen(false)} />
    </div>
  );
}
