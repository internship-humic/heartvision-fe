"use client";

import React from "react";

interface DetectionStepperProps {
  currentStep: number;
}

const STEPS = [
  { step: 1, label: "Upload X-ray" },
  { step: 2, label: "AI Detection" },
  { step: 3, label: "Choose Doctor" },
  { step: 4, label: "Give a Note" },
  { step: 5, label: "Final Result" },
];

export default function DetectionStepper({ currentStep }: DetectionStepperProps) {
  return (
    <div className="w-full bg-white border border-[#DEE8FF] rounded-[12px] px-4 sm:px-10 py-4 sm:py-5 shadow-sm flex justify-between relative overflow-x-auto">
      {STEPS.map((stepInfo, idx) => {
        const isCompleted = stepInfo.step < currentStep;
        const isActive = stepInfo.step === currentStep;
        const isPastOrActive = stepInfo.step <= currentStep;

        return (
          <div key={stepInfo.step} className="flex items-center flex-1 last:flex-none mb-4">
            <div className="flex flex-col items-center gap-2 relative z-10 ">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${isPastOrActive
                  ? "bg-[#2170FD] text-white shadow-md shadow-[#2170FD]/20"
                  : "bg-[#F3F4F6] text-[#9CA3AF] border border-slate-200"
                  }`}
              >
                {stepInfo.step}
              </div>
              <span
                className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-wider absolute mt-10 sm:mt-12 whitespace-nowrap transition-colors duration-300 ${
                  stepInfo.step === currentStep ? "block" : "hidden md:block"
                } ${isPastOrActive ? "text-[#2170FD]" : "text-[#9CA3AF]"}`}
              >
                {stepInfo.label}
              </span>
            </div>

            {/* Connecting line */}
            {idx < STEPS.length - 1 && (
              <div className="flex-1 h-[3px] mx-1 sm:mx-2 bg-[#EAF2FC] rounded-full relative">
                <div
                  className="absolute left-0 top-0 h-full bg-[#2170FD] transition-all duration-500 ease-out rounded-full"
                  style={{ width: isCompleted ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
