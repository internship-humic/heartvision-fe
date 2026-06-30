"use client";

import React from "react";
import Image from "next/image";
import { useSafeImageSrc } from "@/utils/api";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  experience?: string;
  verified?: boolean;
  about?: string;
  schedule?: string;
  scheduleTime?: string;
}

interface DoctorProfileModalProps {
  isOpen: boolean;
  doctor: Doctor | null;
  onClose: () => void;
}

export default function DoctorProfileModal({ isOpen, doctor, onClose }: DoctorProfileModalProps) {
  const safeSrc = useSafeImageSrc(doctor?.image || "/landing/female-doctor-hero-white.png");

  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 flex flex-col gap-5 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#111C2D] transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Doctor Header: Image + Info */}
        <div className="flex items-start gap-4">
          {/* Doctor Image - Square with rounded corners */}
          <div className="relative w-24 h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0">
            <Image
              src={safeSrc}
              alt={doctor.name}
              fill
              className="object-cover object-top"
            />
          </div>

          {/* Doctor Info */}
          <div className="flex flex-col gap-1 pt-1">
            <h3 className="text-lg font-bold text-[#111C2D]">{doctor.name}</h3>
            <p className="text-sm text-[#2170FD] font-medium">{doctor.specialty}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-[#64748B]">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                {doctor.experience || "8 years"}
              </span>
              {doctor.verified !== false && (
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-[#2170FD]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E2E8F0]" />

        {/* About Doctor */}
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-bold text-[#111C2D]">About Doctor</h4>
          <p className="text-sm text-[#64748B] leading-relaxed">
            {doctor.about || "A dedicated cardiologist with expertise in the diagnosis and treatment of heart disease. Experienced in providing comprehensive care for patients with a variety of cardiovascular conditions using the latest medical technology."}
          </p>
        </div>

        {/* Practice Schedule */}
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-bold text-[#111C2D]">Practice Schedule</h4>
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 w-fit">
            <p className="text-[10px] font-semibold text-[#2170FD] uppercase tracking-wider">{doctor.schedule || "Monday - Wednesday"}</p>
            <p className="text-base font-bold text-[#111C2D] mt-0.5">{doctor.scheduleTime || "09:00 - 15:00"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
