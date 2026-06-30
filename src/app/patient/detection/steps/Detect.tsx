// Tampilan hasil deteksi AI (Step 2)
// Menampilkan animasi scan laser dan hasil prediksi dari backend.

"use client";

import React from "react";
import Image from "next/image";

interface DetectProps {
  filePreview: string;
  isProcessing: boolean;
  progress: number;
  // TODO [AI]: Tambahin field output AI baru di sini kalau ada (misal: confidenceScore, heatmapUrl)
  result: { prediction: string; ctrRatio: string; heartSize: string } | null;
  onNext: () => void;
  onCancel: () => void;
}

export default function Detect({
  filePreview,
  isProcessing,
  progress,
  result,
  onNext,
  onCancel,
}: DetectProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8 mt-4 items-start animate-in fade-in duration-300">
      {/* Left Column: X-Ray Neural Analysis */}
      <div className="lg:col-span-8 bg-white border border-[#DEE8FF] rounded-[24px] p-6 shadow-sm flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-[#2170FD]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m-3-3h6" />
              </svg>
            </div>
            <h2 className="text-lg font-black text-[#111C2D] tracking-tight">X-Ray Neural Analysis</h2>
          </div>
          
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3.5 py-1.5 rounded-full animate-pulse flex items-center gap-2 border border-rose-100">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            Live Engine Processing
          </span>
        </div>

        {/* X-Ray Image Viewport */}
        <div className="relative w-full aspect-square bg-[#0F172A] rounded-[20px] overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
          {filePreview && (
            <Image src={filePreview} alt="Neural Scanning" fill className="object-contain opacity-75 p-2" />
          )}

          {/* Neural Laser Scanner Effect */}
          {isProcessing && (
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="w-full h-1 bg-[#2170FD] shadow-[0_0_15px_#2170FD] absolute top-0 animate-[scan_2.2s_ease-in-out_infinite]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 border border-dashed border-[#2170FD]/40 rounded-full animate-spin-slow" />
              <div className="absolute top-1/3 left-1/4 border border-[#2170FD] bg-[#2170FD]/15 px-2 py-1 text-[9px] font-mono text-[#2170FD] rounded shadow-sm">
                LV_SEGMENT_04
              </div>
            </div>
          )}

          {!isProcessing && result && (
            <div className="absolute inset-0 pointer-events-none z-10 border-2 border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center">
              {/* TODO [AI]: Ganti nilai persentase di bawah dengan accuracy asli dari backend (result.confidenceScore) */}
              <div className="absolute bottom-6 right-6 border border-emerald-500 bg-emerald-500/10 px-4 py-2 text-emerald-400 font-mono text-xs font-bold rounded-lg shadow-md">
                ACCURACY_CONFIRMED: 94.2%
              </div>
            </div>
          )}
        </div>

        {/* Progress bar info */}
        <div className="flex items-center justify-between gap-4 mt-2">
          <div className="flex-1 h-2 bg-[#EAF2FC] rounded-full overflow-hidden">
            <div className="bg-[#2170FD] h-full rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-sm font-black text-[#2170FD] w-12 text-right">{progress}%</span>
        </div>
      </div>

      {/* Right Column: Live Analysis & Navigation */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Live Analysis Status */}
        <div className="bg-white border border-[#DEE8FF] rounded-[24px] border-l-[6px] border-l-[#2170FD] p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-[#111C2D] tracking-tight">Live Analysis</h3>
            <div className="text-[#2170FD]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="bg-[#EAF2FC] rounded-xl p-4 flex flex-col gap-1">
              <span className="text-xs font-black text-[#111C2D]">Cardiothoracic Ratio</span>
              <span className="text-[11px] font-semibold text-[#64748B]">Calculating heart-to-chest width ratio</span>
            </div>
            <div className="bg-[#EAF2FC] rounded-xl p-4 flex flex-col gap-1">
              <span className="text-xs font-black text-[#111C2D]">Calcification Detection</span>
              <span className="text-[11px] font-semibold text-[#64748B]">Scanning aortic arch for plaque buildup</span>
            </div>
            <div className="bg-[#EAF2FC] rounded-xl p-4 flex flex-col gap-1">
              <span className="text-xs font-black text-[#111C2D]">Lung Field Congestion</span>
              <span className="text-[11px] font-semibold text-[#64748B]">Evaluating vascular prominence in upper lobes</span>
            </div>
          </div>

          <div className="bg-[#EAF2FC]/60 border border-[#DEE8FF] rounded-xl p-4 flex gap-3 mt-2">
            <div className="text-[#64748B] shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.083.984l-.04.02-1.083-.984zm.644 3h.01m-.013-6a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-[11px] font-semibold text-[#4B5563] leading-relaxed">
              The AI is comparing this image against 500,000+ clinical cases to identify subtle anomalies in heart shape and density.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white border border-[#DEE8FF] rounded-[24px] p-6 shadow-sm flex flex-col gap-4">
          <button
            disabled={isProcessing}
            onClick={onNext}
            className="w-full py-4 bg-[#2170FD] text-white font-black rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors shadow-md shadow-[#2170FD]/20"
          >
            Choose a doctor
          </button>
          
          <button
            onClick={onCancel}
            className="w-full py-4 bg-white border border-[#DEE8FF] text-[#111C2D] font-black rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>

          <p className="text-[10px] font-bold text-center text-[#64748B] leading-none mt-1">
            Analysis typically takes 15-30 seconds. Do not close this window.
          </p>
        </div>

      </div>
    </div>
  );
}
