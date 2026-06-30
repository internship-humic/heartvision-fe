"use client";

import React from "react";

interface GiveNoteProps {
  symptoms: string;
  onChangeSymptoms: (value: string) => void;
  onSubmit: () => void;
  selectedDoctorName?: string;
  selectedDoctorSpecialty?: string;
  selectedDoctorImage?: string;
  onChangeDoctor: () => void;
  isSubmitting?: boolean;
}

export default function GiveNote({
  symptoms,
  onChangeSymptoms,
  onSubmit,
  isSubmitting,
}: GiveNoteProps) {
  return (
    <div className="flex flex-col gap-4 mt-2 text-left">
      {/* Title & Description */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-[#111C2D]">Add Notes</h2>
        <p className="text-sm text-[#64748B] font-normal leading-relaxed">
          Please provide additional context for the diagnostic report. This information will be reviewed by the assigned cardiologist.
        </p>
      </div>

      {/* Content: Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Detailed Symptoms */}
        <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-2xl p-6 flex flex-col gap-3">
          <label className="text-sm font-semibold text-[#111C2D]">Detailed Symptoms</label>
          <textarea
            rows={12}
            value={symptoms}
            onChange={(e) => onChangeSymptoms(e.target.value)}
            placeholder="Tell us your complaint in detail here..."
            className="w-full bg-white border border-[#E2E8F0] rounded-xl p-4 text-sm focus:outline-none focus:border-[#2170FD] transition-all text-[#4B5563] placeholder-[#9CA3AF] resize-none font-normal"
          />
        </div>

        {/* Right Column: Info Cards */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Privacy Assurance Card */}
          <div className="bg-white border-l-4 border-l-[#2170FD] border border-[#E2E8F0] rounded-xl p-5 flex gap-3 items-start">
            <div className="w-8 h-8 bg-[#EFF6FF] rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-[#2170FD]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-semibold text-[#111C2D]">Privacy Assurance</h4>
              <p className="text-xs text-[#64748B] leading-relaxed font-normal">
                Vitalis AI ensures your medical data is secure and encrypted. Only authorized medical personnel can access your detailed health history.
              </p>
            </div>
          </div>

          {/* Next Step Card */}
          <div className="bg-white border-l-4 border-l-[#2170FD] border border-[#E2E8F0] rounded-xl p-5 flex gap-3 items-start">
            <div className="w-8 h-8 bg-[#EFF6FF] rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-[#2170FD]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-semibold text-[#111C2D]">Next Step</h4>
              <p className="text-xs text-[#64748B] leading-relaxed font-normal">
                Once submitted, the AI analysis results and your notes will be combined into a final report for your doctor to review.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final Analysis Button - aligned right, full width of right column area */}
      <div className="flex justify-end mt-2">
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-12 py-3.5 bg-[#2170FD] text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors cursor-pointer text-sm w-full lg:w-auto lg:min-w-[300px] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Final Analysis"}
        </button>
      </div>
    </div>
  );
}
